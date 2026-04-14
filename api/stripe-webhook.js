// /api/stripe-webhook.js
// Vercel serverless function — handles Stripe webhook events
// Verifies signature, then writes to Supabase on checkout.session.completed

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Disable Vercel's body parser — we need the raw body for signature verification
module.exports.config = { api: { bodyParser: false } };

// Credit amounts (GBP product → USD credit value)
const CREDIT_MAP = {
  topup_10: 12.50,
  topup_20: 25.00,
  topup_50: 62.50,
};

// Read raw body as Buffer
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // ── Verify Stripe signature ──────────────────────────────────────
  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('[webhook] Signature verification failed:', e.message);
    return res.status(400).json({ error: `Webhook signature error: ${e.message}` });
  }

  // ── Only handle checkout.session.completed ───────────────────────
  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true, ignored: true });
  }

  const session = event.data.object;
  const { userId, type } = session.metadata || {};

  if (!userId || !type) {
    console.error('[webhook] Missing metadata — userId or type not set');
    return res.status(400).json({ error: 'Missing metadata' });
  }

  // ── Supabase admin client (service role — bypasses RLS) ─────────
  const sb = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  try {
    if (CREDIT_MAP[type] !== undefined) {
      // ── TOPUP ────────────────────────────────────────────────────
      const amount = CREDIT_MAP[type];

      // Insert transaction record
      const { error: txErr } = await sb.from('transactions').insert({
        user_id: userId,
        type: 'topup',
        amount_usd: amount,
        description: 'Credit top-up',
        stripe_id: session.id,
      });
      if (txErr) throw new Error(`transactions insert: ${txErr.message}`);

      // Fetch current balance (upsert can't do arithmetic, so read-then-write)
      const { data: existing } = await sb
        .from('credits')
        .select('balance_usd')
        .eq('user_id', userId)
        .single();

      const newBalance = parseFloat(existing?.balance_usd || 0) + amount;

      const { error: credErr } = await sb.from('credits').upsert(
        { user_id: userId, balance_usd: newBalance },
        { onConflict: 'user_id' }
      );
      if (credErr) throw new Error(`credits upsert: ${credErr.message}`);

      console.log(`[webhook] Topped up ${amount} USD for user ${userId}`);

    } else if (type === 'beginner' || type === 'advanced') {
      // ── COURSE PURCHASE ──────────────────────────────────────────

      // Upsert course access row
      const { error: accessErr } = await sb.from('course_access').upsert(
        { user_id: userId, tier: type },
        { onConflict: 'user_id' }
      );
      if (accessErr) throw new Error(`course_access upsert: ${accessErr.message}`);

      // Insert transaction record
      const { error: txErr } = await sb.from('transactions').insert({
        user_id: userId,
        type: 'purchase',
        amount_usd: 0,
        description: `Course purchase: ${type}`,
        stripe_id: session.id,
      });
      if (txErr) throw new Error(`transactions insert: ${txErr.message}`);

      console.log(`[webhook] Granted ${type} course access for user ${userId}`);

    } else {
      console.warn(`[webhook] Unrecognised type: ${type}`);
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('[webhook] DB error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};

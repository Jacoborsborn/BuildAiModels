// /api/stripe-webhook.js
// Vercel serverless function — handles Stripe webhook events
// Verifies signature, then grants course access on checkout.session.completed

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Disable Vercel's body parser — we need the raw body for signature verification
module.exports.config = { api: { bodyParser: false } };

// What each purchasable type unlocks. Additive: rows are (user_id, product),
// so buying the SEO kit later never overwrites agency access.
const GRANT_MAP = {
  agency: ['agency'],           // Web Design Agency Starter Kit
  bundle: ['agency', 'seo'],    // Kit + SEO Automation Kit
  seo:    ['seo'],              // standalone SEO kit (price ID added later)
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

  const products = GRANT_MAP[type];
  if (!products) {
    console.warn(`[webhook] Unrecognised type: ${type}`);
    return res.status(200).json({ received: true, ignored: true });
  }

  // ── Supabase admin client (service role — bypasses RLS) ─────────
  const sb = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  try {
    // Grant one row per product — additive, never overwrites other courses
    const { error: accessErr } = await sb.from('course_access').upsert(
      products.map(product => ({ user_id: userId, product })),
      { onConflict: 'user_id,product' }
    );
    if (accessErr) throw new Error(`course_access upsert: ${accessErr.message}`);

    // Log the transaction
    const { error: txErr } = await sb.from('transactions').insert({
      user_id: userId,
      type: 'purchase',
      amount_usd: 0,
      description: `Course purchase: ${type}`,
      stripe_id: session.id,
    });
    if (txErr) throw new Error(`transactions insert: ${txErr.message}`);

    console.log(`[webhook] Granted [${products.join(', ')}] to user ${userId}`);
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('[webhook] DB error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};

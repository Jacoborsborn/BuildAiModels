// /api/create-checkout.js
// Vercel serverless function — creates a Stripe Checkout session
// POST { type, userId, userEmail } → { url }

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Reused price IDs: `agency` was the old `beginner` tier, `bundle` was `advanced`.
// Amounts + product names/descriptions are managed in the Stripe dashboard — IDs stay.
const PRICE_MAP = {
  agency: 'price_1TMED4DbHWgvBRLbBu3XYchs', // Web Design Agency Starter Kit
  bundle: 'price_1TMEDQDbHWgvBRLbwcFK5wK0', // Agency Kit + SEO Automation Kit
};

const ALLOWED_ORIGINS = [
  'https://buildaimodels.co.uk',
  'https://www.buildaimodels.co.uk',
  'http://localhost:3000',
];

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, userId, userEmail } = req.body || {};

  const priceId = PRICE_MAP[type];
  if (!priceId) {
    return res.status(400).json({ error: `Invalid type: "${type}". Must be one of: ${Object.keys(PRICE_MAP).join(', ')}` });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail || undefined,
      client_reference_id: userId || undefined,
      metadata: { userId: userId || '', type },
      success_url: 'https://buildaimodels.co.uk/account?payment=success',
      cancel_url:  'https://buildaimodels.co.uk/account?payment=cancelled',
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('[create-checkout] Stripe error:', e.message);
    return res.status(500).json({ error: e.message });
  }
};

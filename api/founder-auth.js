// /api/founder-auth.js
// Validates founder passwords server-side.
// Returns which founder mode to enter ('jacob' or 'ethan') or 401.
// Env vars: J_PASSWORD, E_PASSWORD

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { password } = req.body || {};
    if (!password) return res.status(400).json({ error: 'No password provided' });

    const writeKey = process.env.COURSE_WRITE_KEY || '';
    if (password === process.env.J_PASSWORD) {
      return res.status(200).json({ founder: 'jacob', writeKey });
    }
    if (password === process.env.E_PASSWORD) {
      return res.status(200).json({ founder: 'ethan', writeKey });
    }

    return res.status(401).json({ error: 'Invalid password' });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
};

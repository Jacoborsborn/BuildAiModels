// /api/keys.js
// Returns API keys to authenticated users only.
// Vercel env vars used (never exposed to client):
//   KIE_API_KEY, LZ_API_KEY, WS_API_KEY, EVOLINK_KEY   ← Jacob's keys (all users)
//   E_LZ_API_KEY, E_WS_API_KEY                          ← Ethan's keys (ethan founder mode)

const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Verify Supabase JWT
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing auth token' });
  }
  const token = auth.slice(7);

  try {
    const sb = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY,
      { auth: { persistSession: false } }
    );
    const { data: { user }, error } = await sb.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });

    // Ethan founder mode — return his personal keys
    const founder = req.query.founder;
    if (founder === 'ethan') {
      return res.status(200).json({
        lz_api_key:   process.env.E_LZ_API_KEY  || '',
        ws_api_key:   process.env.E_WS_API_KEY  || '',
        kie_api_key:  '',
        evolink_key:  '',
      });
    }

    // All other authenticated users — Jacob's (BAM) keys
    return res.status(200).json({
      kie_api_key:  process.env.KIE_API_KEY  || '',
      lz_api_key:   process.env.LZ_API_KEY   || '',
      ws_api_key:   process.env.WS_API_KEY   || '',
      evolink_key:  process.env.EVOLINK_KEY  || '',
    });
  } catch (e) {
    console.error('keys.js error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
};

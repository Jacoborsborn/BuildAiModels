// /api/course-content.js
// Read/write course content (blocks + structure overrides) to Supabase.
// GET  → public, returns { structure, blocks }
// POST → founder-only, body: { founder, key: 'structure'|'blocks', data: {...} }
//
// Supabase table: course_content
//   key         TEXT PRIMARY KEY
//   data        JSONB
//   updated_at  TIMESTAMPTZ DEFAULT now()

const { createClient } = require('@supabase/supabase-js');

function getSb() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET — public read ─────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const sb = getSb();
      const { data, error } = await sb
        .from('course_content')
        .select('key, data')
        .in('key', ['structure', 'blocks']);

      if (error) throw error;

      const result = { structure: null, blocks: null };
      (data || []).forEach(row => { result[row.key] = row.data; });
      return res.status(200).json(result);
    } catch (e) {
      console.error('course-content GET error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // ── POST — founder write ──────────────────────────────────────────
  if (req.method === 'POST') {
    const { founder, key, data } = req.body || {};

    // Validate write key
    const { writeKey } = req.body || {};
    const expectedKey = process.env.COURSE_WRITE_KEY;
    if (!expectedKey || writeKey !== expectedKey) {
      return res.status(401).json({ error: 'Invalid write key' });
    }

    // Validate key
    if (!['structure', 'blocks'].includes(key)) {
      return res.status(400).json({ error: 'key must be structure or blocks' });
    }
    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'data required' });
    }

    try {
      const sb = getSb();
      const { error } = await sb
        .from('course_content')
        .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: 'key' });

      if (error) throw error;
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('course-content POST error:', e);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

// archive/export-course-content.js
// Exports the old AI-influencer course_content rows to JSON before wiping.
// Could not run on 2026-07-05: the Supabase project host did not resolve
// (project paused or deleted). Restore it in the Supabase dashboard, then:
//
//   node archive/export-course-content.js
//
// Writes archive/course_content-v1-aimodels.json. Offer the export to Ethan,
// then run step 5 of migration-multi-course.sql to wipe.

const fs = require('fs');
const path = require('path');

const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const get = k => (env.match(new RegExp('^' + k + '=(.*)$', 'm')) || [])[1]?.trim();

const url = get('SUPABASE_URL');
const key = get('SUPABASE_SERVICE_KEY');

(async () => {
  const r = await fetch(`${url}/rest/v1/course_content?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const data = await r.json();
  if (!r.ok) {
    console.error('Export failed:', JSON.stringify(data));
    process.exit(1);
  }
  const out = path.join(__dirname, 'course_content-v1-aimodels.json');
  fs.writeFileSync(out, JSON.stringify(data, null, 2));
  console.log(`Exported ${data.length} rows → ${out}`);
})();

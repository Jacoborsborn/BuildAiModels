#!/usr/bin/env node
/*
 * Generates sitemap.xml for buildaimodels.co.uk.
 *
 * The page list comes from scripts/lib/public-urls.js — marketing pages are an
 * explicit allow-list (auth/account/course stay out), blog posts are
 * auto-discovered from blog/<slug>/index.html. Add a blog post → it lands here
 * automatically. lastmod comes from each file's mtime, so the sitemap can only
 * list real pages.
 *
 * Run before committing whenever you add or change a public page:
 *   node scripts/build-sitemap.js
 */
const fs = require('fs');
const path = require('path');
const { ROOT, getPublicPages, lastmod } = require('./lib/public-urls');

const BASE = 'https://buildaimodels.co.uk';

const items = [];
for (const p of getPublicPages()) {
  const lm = lastmod(p);
  if (!lm) { console.warn('⚠ skipping missing page:', p.url); continue; }
  items.push(
    `  <url>\n    <loc>${BASE}${p.url}</loc>\n    <lastmod>${lm}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
  );
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${items.join('\n')}\n` +
  `</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`✓ sitemap.xml written with ${items.length} URLs`);

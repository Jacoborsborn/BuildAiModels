/*
 * Single source of truth for which URLs are public + indexable on
 * buildaimodels.co.uk. Ported from the sitework.uk pipeline.
 *
 * Both build-sitemap.js and indexnow-ping.js import this so they can never
 * drift apart. Marketing pages are an explicit allow-list — auth, account,
 * course and waitlist pages must NOT be indexed. Blog posts are
 * auto-discovered from blog/<slug>/index.html, so a new post is picked up
 * automatically with zero edits here.
 *
 * BAM uses Vercel rewrites for clean URLs (/ → BAMLanding.html), so each
 * marketing entry names its on-disk file for lastmod stamping.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

// Public, indexable marketing pages (explicit — app pages intentionally excluded).
const MARKETING = [
  { url: '/',      file: 'BAMLanding.html', priority: '1.0' },
  { url: '/blog/', file: 'blog/index.html', priority: '0.7' },
  { url: '/legal', file: 'BAMLegal.html',   priority: '0.3' },
];

// Auto-discovered blog posts: any blog/<slug>/index.html.
function discoverBlogPosts() {
  const blogDir = path.join(ROOT, 'blog');
  let entries = [];
  try { entries = fs.readdirSync(blogDir, { withFileTypes: true }); }
  catch { return []; }

  return entries
    .filter((e) => e.isDirectory())
    .filter((e) => fs.existsSync(path.join(blogDir, e.name, 'index.html')))
    .map((e) => ({ url: `/blog/${e.name}/`, file: `blog/${e.name}/index.html`, priority: '0.8' }))
    .sort((a, b) => a.url.localeCompare(b.url));
}

function lastmod(page) {
  try {
    return fs.statSync(path.join(ROOT, page.file)).mtime.toISOString().slice(0, 10);
  } catch {
    return null;
  }
}

// Full public set: marketing pages + every blog post.
function getPublicPages() {
  return [...MARKETING, ...discoverBlogPosts()];
}

module.exports = { ROOT, getPublicPages, lastmod };

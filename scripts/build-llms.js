#!/usr/bin/env node
/*
 * Regenerates llms.txt for buildaimodels.co.uk.
 *
 * AI crawlers (ChatGPT, Perplexity, Gemini, Claude) read /llms.txt first to
 * understand the site. The static sections below are the source of truth for
 * the offer + key pages; the "## Blog guides" list is AUTO-GENERATED from every
 * blog/<slug>/index.html so a new post appears here with zero manual edits —
 * the same auto-discovery the sitemap uses (scripts/lib/public-urls.js).
 *
 * Title + description for each post come from its <title> and og:description.
 * Newest post first (by file mtime).
 *
 * Run before committing whenever you add or change a public page:
 *   node scripts/build-llms.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://www.buildaimodels.co.uk';

// ── Static sections (edit these by hand; the offer rarely changes) ──────────
const HEADER = `# BuildAIModels: The Web Design Agency Starter Kit

> BuildAIModels is the documented system of a real, running UK web design agency (sitework.uk), packaged as a course. It teaches you to run an AI-powered web design agency for local trades: Claude Code does the building, you run the business. 14 modules cover the offer and pricing (£50–150/month done-for-you retainers), scraping and qualifying leads, cold outreach with the UK legal rules (TPS, PECR, GDPR), closing, fulfilment and retention. No code or design background needed. One-time payment, lifetime updates, and module 00 is free forever.

## Offer
- Agency Starter Kit: £99 one-time for all 14 modules, every update, the full prompt & script library, lead sheet + contract templates.
- Kit + SEO Automation: £179 one-time for everything in the Starter Kit plus the SEO Automation Kit (content engine, domain warming, GEO writing for AI search) to sell back to clients as a monthly add-on.
- Module 00 is free forever: the whole system and tool stack shown before any payment.
- 14-day refund policy on unaccessed content. No subscription, no upsell funnel behind the checkout.
- Built from one real agency: 300+ leads mined, qualified and called with this system; £50–150/month retainers; 0 paid ads or lead fees.`;

const KEY_PAGES = `## Key pages
- [Home](${BASE}/): The Web Design Agency Starter Kit. Learn the agency, then run the agency.
- [What's Included](${BASE}/whats-included): All 14 modules in four phases, plus the prompt library, scripts, lead sheets and contract templates.
- [Pricing](${BASE}/pricing): £99 Starter Kit or £179 with the SEO Automation Kit, both one-time.
- [About](${BASE}/about): The founder and the real agency (sitework.uk) behind the course.
- [Blog](${BASE}/blog/): Honest guides on starting an AI web design agency, covering pricing, clients, tools and the UK legal bits.
- [Legal](${BASE}/legal): Terms and privacy policy.`;

const FOOTER = `## About
- Built and run by Jacob Orsborn-Smith, the founder of Sitework (sitework.uk), the UK web design agency the course documents.
- No income claims, no screenshots of other people's Stripe accounts. The free module shows the method before money moves.

## Contact
- Start free: ${BASE}/auth
- Email: orsbornsmithj@gmail.com`;

// ── Auto-discover blog posts and pull title + description from each file ─────
function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
          .replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function meta(html, attr, val) {
  // matches <meta property="og:description" content="..."> in either attr order.
  const re = new RegExp(`<meta[^>]+${attr}=["']${val}["'][^>]*content=(["'])([\\s\\S]*?)\\1`, 'i');
  const re2 = new RegExp(`<meta[^>]+content=(["'])([\\s\\S]*?)\\1[^>]*${attr}=["']${val}["']`, 'i');
  const m = html.match(re) || html.match(re2);
  return m ? decode(m[2]) : null;
}

function discoverPosts() {
  const blogDir = path.join(ROOT, 'blog');
  let entries = [];
  try { entries = fs.readdirSync(blogDir, { withFileTypes: true }); }
  catch { return []; }
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => path.join(blogDir, e.name, 'index.html'))
    .filter((f) => fs.existsSync(f))
    .map((f) => {
      const html = fs.readFileSync(f, 'utf8');
      const slug = path.basename(path.dirname(f));
      const title = decode((meta(html, 'property', 'og:title')
        || (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || slug))
        .replace(/\s*[|—-]\s*BuildAIModels.*$/i, '').trim();
      const desc = meta(html, 'property', 'og:description')
        || meta(html, 'name', 'description') || '';
      return { url: `${BASE}/blog/${slug}/`, title, desc, mtime: fs.statSync(f).mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime); // newest first
}

const posts = discoverPosts();
const blogSection = '## Blog guides\n' +
  posts.map((p) => `- [${p.title}](${p.url})${p.desc ? ': ' + p.desc : ''}`).join('\n');

const out = [HEADER, blogSection, KEY_PAGES, FOOTER].join('\n\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'llms.txt'), out);
console.log(`✓ llms.txt written with ${posts.length} blog posts`);

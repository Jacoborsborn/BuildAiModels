#!/usr/bin/env node
/*
 * Pings IndexNow with the current public URLs so they get crawled within hours,
 * not weeks. IndexNow feeds Bing and Yandex — and Bing's index is what ChatGPT
 * Search and Copilot lean on, so this is the fast lane into AI answers.
 *
 * The URL list comes from scripts/lib/public-urls.js (same source as the
 * sitemap), so blog posts are included automatically.
 *
 * Run AFTER deploying new or updated pages:
 *   node scripts/indexnow-ping.js
 */
const https = require('https');
const { getPublicPages } = require('./lib/public-urls');

const HOST = 'www.buildaimodels.co.uk';
const KEY = 'b52c083553398e347d55f5279ea3db13'; // must match /<KEY>.txt at the site root

const URLS = getPublicPages().map((p) => `https://${HOST}${p.url}`);

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: URLS,
});

const req = https.request(
  {
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    },
  },
  (res) => {
    console.log(`IndexNow: pinged ${URLS.length} URLs → ${res.statusCode} (200/202 = accepted)`);
    res.on('data', (d) => process.stdout.write(d));
  }
);
req.on('error', (e) => console.error('IndexNow error:', e.message));
req.write(body);
req.end();

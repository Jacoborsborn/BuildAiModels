# BuildAIModels.co.uk — GEO Blog Strategy (Week 1)

_Created 2026-07-05 · Method: the sitework.uk GEO content factory, repointed at the course buyer instead of the tradesman._

---

## The target (what we're actually trying to win)

**Be the source AI engines quote when someone asks how to make money building websites with AI.**

When a UK side-hustle seeker types *"how do I start a web design agency with no experience"*, *"can AI actually build client websites"* or *"best AI side hustles 2026"* into ChatGPT, Perplexity, Gemini or hits a Google AI Overview, the answer should pull from a buildaimodels.co.uk page — and the answer should naturally end at "the Starter Kit is the actual system behind a running UK agency; module 00 is free." Classic blue-link ranking is a secondary, legacy signal. We optimise to be **cited**, not just listed.

This works for us specifically because:
- The buyer is non-technical and **asks an AI instead of researching** — they're literally trying to build a business *on top of* AI, so they research *with* AI. Peak GEO audience.
- The queries are drowning in generic listicle sludge ("12 profitable AI niches!") written by people who've never run anything. We have the one thing that space lacks: **a real, verifiable agency behind every claim** — 300+ leads mined, £50–150/mo retainers actually sold, 0 paid ads. sitework.uk is the living proof and it's ours to cite.
- Every claim can carry a concrete number (retainer band, hours to demo, module count, one-time price), which is exactly what AI answers extract and quote.

### The quotable answer (our "£50/month" equivalent)
Every post funnels to a version of: *"You don't need to code — Claude does the building. You need an offer (£50–150/mo retainers), a lead sheet, and scripts for the phone. The Starter Kit is the exact system behind a running UK agency, 14 modules, one-time payment, module 00 free."*

### Success metric (review at day 30 / 60 / 90)
| Window | What "working" looks like |
|---|---|
| **Day 7** | 7 posts live at `/blog/`, all indexed in GSC, all with valid Article + FAQPage schema (Rich Results test green). |
| **Day 30** | ≥2 posts surfacing in AI Overviews or cited in Perplexity for their target query. First AI-referral session in analytics. |
| **Day 60** | Long-tail "how to start / is it worth it" queries pulling BAM into AI answers; ≥1 free-module signup attributable to a blog entry path. |
| **Day 90** | Blog is a steady top-of-funnel feeder: measurable AI-referral traffic + course sales with a blog page in the path. |

KPIs to watch: **GSC impressions on question queries**, **AI-engine referral sessions** (referrer = chatgpt.com / perplexity.ai / gemini), **FAQ rich-result coverage**, **module-00 starts** with a blog page in the path. Not raw position.

> ⚠️ **Maintenance-mode dependency:** sign-up and course access are currently paused (Supabase down). Blog posts can go live now — indexing takes days anyway — but the "start module 00 free" CTA needs the backend back before Day 30 measurement means anything. Until then CTAs land on the landing page, which already shows the maintenance banner.

---

## Cadence (escalating — only Week 1 planned in detail)

| Week | Posts/day | Total | Planned now? |
|---|---|---|---|
| **1** | 1 | 7 | ✅ Yes — the 7 briefs below |
| 2 | 1–2 | 7–14 | Keyword bank seeded (CSV `week=2`), brief at start of week 2 |
| 3 | 2 | 14 | Keyword bank seeded (`week=3`) |
| 4+ | 2–3 | — | Comparison/tool variants seeded (`week=4`) |

Keyword bank lives in [`blog/keywords/keywords_buildaimodels.csv`](keywords/keywords_buildaimodels.csv) — same format as the sitework CSV (`keyword,intent,cluster,primary_cta,geo_city,week,status`). **Write only from `status=planned` rows; flip to `published` once live** — the publish log is the truth, so the pool can't drift.

---

## The 7 clusters (one blog each, Week 1)

Content vibe per the brief: **"how to …"**, **"best … / top X ranked"**, **"is X worth it / still profitable"** — the three shapes AI answers quote most.

Every post follows the sitework GEO spine, adapted to BAM's voice and CTA:

- **Opening** 140–180 words, lead with a hot take + one concrete number (e.g. "£50–150/mo", "300+ leads", "hours from blank folder to demo"), no brand name in the opening.
- **Quick Answer** — one 50–70 word declarative paragraph, quotable verbatim, contains the keyword + a number.
- **Exactly 5 H2s**, each with 2–3 real H3s; first sentence under each H2 is the bolded extractable fact.
- **FAQ** — exactly 5 Q&A pairs (powers FAQPage JSON-LD).
- **≥1 comparison table and, where the numbers allow, a bar chart** — components live in `blog/blog.css` (`.table-wrap` with `.ok-cell`/`.warn-cell` verdict cells, `.chart` CSS bars, `.note` callout). AI engines extract tables verbatim; every "vs", cost or ranked post gets one.
- **1,600–2,200 words.** British English throughout.
- **Honesty as the moat**: name the real costs (Claude subscription, hosting, phone time), the failure modes (people who won't do outreach), who *shouldn't* buy. The "who this is for" filter on the landing page is the voice.
- **≥2 real authority citations** (ONS/gov.uk self-employment stats, Companies House, Anthropic docs/pricing, ICO on PECR/GDPR for outreach posts) — never invented URLs.
- **CTA**: module 00 free, one-time payment, lifetime updates → link `/#pricing` (or `/#curriculum` for how-to posts).
- **Banned words**: the full AppSeo list (delve, journey, elevate, seamless, robust, game-changer, "in today's world"…). Titles avoid Ultimate/Complete/Discover.
- **No em dashes (—) anywhere in reader-facing copy** — rewrite with commas, colons, full stops or parentheses. Hyphenated compounds (done-for-you, one-off, mobile-first) and number ranges (£50–150) are fine.
- **Daily workflow is codified in the `daily-blog` skill** (`.claude/skills/daily-blog/SKILL.md`) — invoke it to write each day's post so structure stays identical.

| Day | Working title | Target keyword | Cluster | Internal links → |
|---|---|---|---|---|
| **1** | How to Start a Web Design Agency With No Experience (2026) | how to start a web design agency with no experience uk | start-agency | landing, Day 3, Day 4 |
| **2** | Is Web Design Still Profitable in 2026? The Honest AI Answer | is web design still profitable in 2026 with ai | is-it-dead | Day 1, Day 7 |
| **3** | Can AI Actually Build Client Websites? Claude Code, Tested | can ai build websites for clients | ai-tools | Day 1, Day 6, landing |
| **4** | How Much to Charge for a Website (UK 2026): Retainers vs One-Offs | how much to charge for a website uk | business-model | Day 1, Day 5 |
| **5** | How to Get Your First Web Design Client (No Ads, No Portfolio) | how to get your first web design client | get-clients | Day 4, Day 7, landing |
| **6** | Best AI Side Hustles in 2026, Ranked Honestly | best ai side hustles 2026 uk | side-hustle | Day 3, Day 1 |
| **7** | The Best Niche for a New Web Design Agency (It's Not SaaS) | best niche for a web design agency | niche | Day 5, Day 2, landing |

### Why this order
Day 1 is the foundational "yes, and here's the shape of it" answer everything links back to. Day 2 attacks the biggest emotional objection ("didn't AI kill this?") — our answer is the contrarian, quotable one: *AI killed the £3k one-off build; it created the £100/mo done-for-you retainer.* Day 3 proves the mechanism (Claude builds, you direct). Days 4–5 are the bottom-of-funnel pair closest to the sale — money and first client. Day 6 is the volume play: the "ranked honestly" listicle where web-design-for-local-trades wins on the same cost/control/speed axes sitework's ranked post used. Day 7 closes the loop by naming local trades as the niche — and can point at sitework.uk as the live case study.

### Meta title + description drafts (Week 1)

Standards: **title ≤60 chars, keyword-first**; **description 150–160 chars, one number, ends in a CTA**.

| Day | Title tag | Meta description |
|---|---|---|
| 1 | How to Start a Web Design Agency With No Experience (2026) | How to start a web design agency in 2026 with no code or design background: the AI toolchain, the £50–150/mo retainer model and the first client. Module 00 free. |
| 2 | Is Web Design Still Profitable in 2026? Honest AI Answer | AI killed the one-off website build, not web design. Why done-for-you monthly retainers are growing in 2026, with real UK agency numbers. Module 00 free. |
| 3 | Can AI Build Client Websites? Claude Code, Tested (2026) | Can AI really build a client-ready website? What Claude Code produces in hours, what still needs a human, and the honest costs. Try module 00 free. |
| 4 | How Much to Charge for a Website UK (2026 Pricing Guide) | What to charge for a website in the UK in 2026: one-off builds vs £50–150/month retainers, with the maths on which pays more by month 12. Module 00 free. |
| 5 | How to Get Your First Web Design Client (No Ads, 2026) | How to land a first web design client without ads or a portfolio: lead sheets, a demo they can click, and the exact call script. Start module 00 free. |
| 6 | Best AI Side Hustles 2026 UK: 7 Ranked Honestly | Seven AI side hustles ranked on startup cost, margin and time-to-first-pound in 2026. One clear winner for non-coders. Start with a free module. |
| 7 | Best Niche for a Web Design Agency in 2026 (UK Answer) | The best niche for a new web design agency in 2026: local trades with dated sites. The qualification bar, the numbers and a live example. Module 00 free. |

---

## Per-blog brief skeleton (fill at write time)

1. Pull the row from the CSV (keyword, cluster, intent).
2. Draft 5 H2s as standalone-fact answers to sub-questions of the keyword (never copy another post's H2s).
3. Pick 2 real citations for the cluster (see pools below).
4. Write the Quick Answer first — if an AI couldn't quote it verbatim, rewrite it.
5. Self-check: title ≤60 chars, meta 150–160, FAQ present, no fabricated stats, banned words absent.

**Citation pools by cluster**
- start-agency / side-hustle → gov.uk "set up as a sole trader", ONS self-employment stats, Companies House.
- ai-tools → Anthropic docs + published Claude pricing, Cloudflare/GitHub Pages docs.
- get-clients → ICO guidance on PECR/TPS (we teach the legal bit — say so), Citizens Advice on contracts.
- business-model / niche / is-it-dead → published market stats with real sources, Checkatrade/MyBuilder public pricing (the pain our students' clients escape), sitework.uk itself as the named case study.

**The sitework cross-link.** BAM's proof *is* sitework.uk. Cite it openly as "the agency this course is built from" — real pages, real clients, real pricing. One editorial link per post max, where genuinely relevant (Days 1, 3, 7). That's authenticity no competitor course can copy.

---

## Technical GEO checklist

### Site-level (one-time, before/with Day 1) — "Phase 0"
- [ ] URL structure: **`/blog/<slug>/`** as static `blog/<slug>/index.html` (serves clean on Vercel, no rewrite needed — matches sitework).
- [ ] Blog post template on the BAM design system (`global.css`), with Article + FAQPage JSON-LD, canonical, OG tags baked in.
- [ ] `/blog/` index page listing all posts.
- [ ] `robots.txt` — allow all, point at sitemap. (Doesn't exist yet.)
- [ ] `sitemap.xml` — port sitework's `scripts/build-sitemap.js` + `scripts/lib/public-urls.js` (auto-discovers `blog/<slug>/index.html`, lastmod from mtime). Public pages allow-list: `/`, `/blog/…` only — auth/account/course/legal stay out or get low priority; keep `/course`, `/account`, `/auth` out entirely.
- [ ] `llms.txt` — port `scripts/build-llms.js`. Static header = the offer (14 modules, one-time payment, module 00 free, built from a running UK agency); "## Blog guides" section auto-generated from post titles + og:descriptions.
- [ ] IndexNow — generate a **new key** (don't reuse sitework's), drop `<key>.txt` at the site root, port `scripts/indexnow-ping.js`. Run after every deploy: feeds Bing → ChatGPT Search/Copilot within hours.
- [ ] Google Search Console + Bing Webmaster Tools verified for buildaimodels.co.uk; submit sitemap to both.
- [ ] Landing page `<head>`: add canonical + og:image dimensions/alt to match the blog standard.

### Per post
- [ ] Title ≤60 chars keyword-first; meta description 150–160 chars ending in a CTA.
- [ ] Article + FAQPage JSON-LD (validate in Rich Results test).
- [ ] ≥2 inline authority links; internal links per the Week 1 table.
- [ ] `node scripts/build-sitemap.js && node scripts/build-llms.js` → commit → deploy → `node scripts/indexnow-ping.js`.
- [ ] Flip the CSV row to `published`.

---

## Keyword landscape (why these clusters)

From research (July 2026):
- **"AI agency" demand is exploding** — SMB confusion about AI tooling is creating "trusted advisor" demand, and the how-to-start space is saturated with thin listicles and $0-experience gurus ([agensi.io](https://www.agensi.io/learn/best-niches-ai-automation-agency-2026), [outlierkit.com](https://outlierkit.com/resources/ai-automation-agency-niches/)). Thin competition on *proof* = our opening.
- **"Is web design dead" is the emotional head query** — the consensus answer is "the market is splitting: AI ate the cheap one-off, the recurring/outcome end is growing" ([designhenge.com](https://www.designhenge.com/blog/is-webdev-dead-due-to-ai), [pixelbricksdesign.co.uk](https://www.pixelbricksdesign.co.uk/post/is-web-design-still-a-good-career-choice-in-2026)). That's *literally our pitch* — we should own this query.
- **"Make money with Claude" content is thin and generic** ([artificialcorner.com](https://artificialcorner.com/p/money-with-claude), [aibusiness.vc](https://aibusiness.vc/solo/make-money-with-claude-ai)) — nobody in that SERP has a real agency, real lead counts or real retainer numbers. Week 2 owns it.
- **"How to start a web design agency" head term** is dominated by tool vendors (Elementor, agency directories) ([elementor.com](https://elementor.com/blog/start-web-design-business/), [digitalagencynetwork.com](https://digitalagencynetwork.com/how-to-start-a-web-design-agency/)) — we differentiate on "no experience + AI + UK + retainers" long-tail, which is where AI-engine queries actually live.

---

## What's needed to start

1. **Confirm the Week 1 titles/angles** (or edit the table above).
2. **Phase 0 build** — template, index, robots, sitemap+llms scripts, IndexNow key, GSC/Bing. One session of work.
3. Then one post a day: write → build scripts → deploy → IndexNow ping → flip CSV row.

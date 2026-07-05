# BAM → Agency Course Platform — Full Audit & Transition Plan

**Date:** 2026-07-05
**Decision:** Pivot buildaimodels.co.uk from the AI-influencer course + credit Studio into the new course business:
**Course 1 — Web Design Agency Starter Kit** and **Course 2 — SEO Automation Kit**.
This supersedes the earlier "hidden page on sitework.uk/kit" plan — BAM becomes the proper storefront + LMS.

---

## PART 1 — AUDIT OF WHAT EXISTS TODAY

### 1.1 Stack

| Layer | What it is | Verdict |
|---|---|---|
| Hosting | Vercel (static HTML + serverless `/api`), rewrites in `vercel.json` | **Keep as-is** |
| Local dev | `server.js` — tiny static server mirroring the rewrites | **Keep** |
| Auth | Supabase auth via `BAMAuth.html` | **Keep, reskin** |
| Payments | Stripe Checkout (`api/create-checkout.js`) + signed webhook (`api/stripe-webhook.js`) | **Keep — this is the crown jewel** |
| DB | Supabase: `credits`, `transactions`, `course_access`, `course_content` | **Keep 2 of 4** (drop credits; keep transactions, course_access, course_content) |
| Content | `api/course-content.js` — course structure + lesson blocks stored as JSONB in Supabase, editable live via founder mode (no redeploy needed) | **Keep — this is a real CMS already** |
| Founder mode | `api/founder-auth.js` — 2 founders (jacob/ethan) + `COURSE_WRITE_KEY` for inline editing | **Keep** |

### 1.2 Pages

| Page | Route | Lines | Verdict |
|---|---|---|---|
| `BAMLanding.html` | `/` | 754 | **Rebuild** — currently sells "hyper-realistic AI influencer models"; wrong product, wrong copy. Section skeleton (hero/marquee/features/pricing/FAQ) is reusable. |
| `Course.html` | `/course` | 1,863 | **Keep engine, replace skin + content.** Full LMS: collapsible module sidebar, lesson dots/progress %, video zone, block-based lesson content, free-preview gating, founder inline editor that writes to Supabase. This is 80% of an LMS build already done. |
| `BAMAccount.html` | `/account` | 784 | **Simplify.** Keep: auth, course purchase card, transaction history, profile. Remove: credit balance, top-ups, per-image pricing table. |
| `BAMAuth.html` | `/auth` | 841 | **Keep, reskin only.** |
| `BAMStudio.html` | `/studio` | 5,789 | **Retire/park** (see decision D1). AI generation studio with credits, API keys, bypass modes — off-brand for a course business and it burns API money. |
| `BAMLegal.html` | `/legal` | 513 | **Keep, rewrite copy** for new products (digital course, refunds, licence). |
| `BAMDreamPrint.html`, `Content Generation*/` | — | — | **Delete/archive** — legacy. |

### 1.3 Payments detail (what "reuse Stripe" actually means)

- `PRICE_MAP` currently has: `topup_10/20/50` (Studio credits — retire) and **`beginner` + `advanced`** (course tiers — reuse; actual £ amounts live in the Stripe dashboard on those price IDs).
- Webhook already: verifies signature → on `checkout.session.completed` grants `course_access` (tier) + logs a transaction. Exactly what the new courses need.
- **⚠️ One real backend limitation found:** `course_access` upserts on `user_id` — **one row per user**. Fine while we sell ONE course. The moment Course 2 (SEO) exists as a separate purchase, buying it would OVERWRITE agency access. Fix in Phase 4 (composite key `user_id + product`, or tier values `agency | seo | bundle` with additive logic).

### 1.4 Current design (to be replaced)

Dark `#080808`, lime `#b8f054`, noise overlay, Bebas Neue + DM Sans + DM Mono, glow/marquee/grid-bg. Classic "dark AI SaaS" — the opposite of the textbook/learning feel we want. `global.css` is a clean small design-token file, which makes the reskin cheap: change the variables + component styles once, all pages follow.

### 1.5 Current course content

7 modules of AI-influencer / Fanvue material (incl. NSFW lessons). **Fully retired** — do not mix with the new brand. Export/archive the Supabase `course_content` rows first if Ethan wants them, then wipe.

### 1.6 Hygiene flags

- `.env` exists locally with live keys — already gitignored, keep it that way; rotate any key that ever appeared in a commit (run gitleaks before pushing the revamp).
- All API endpoints send `Access-Control-Allow-Origin: *` — tighten to the domain during Phase 4.
- Success/cancel URLs hardcoded to `buildaimodels.co.uk/account` — still correct, keep.

---

## PART 2 — THE NEW PRODUCT

### 2.1 Products & pricing

Reuse the two existing Stripe course price IDs at their current prices (per decision: "same price"):

| Stripe key | Was | Becomes |
|---|---|---|
| `beginner` | Beginner tier (AI course) | **Web Design Agency Starter Kit** |
| `advanced` | Advanced tier | **Bundle: Agency Kit + SEO Automation Kit** |
| *(new, later)* | — | SEO Automation Kit standalone (create when Course 2 ships) |

One-time payment, lifetime access, free-preview module stays as the funnel hook (the LMS already supports `free: true` modules — use it: Module 0 of each course is free with account signup = email capture built in).

### 2.2 Course 1 — Web Design Agency Starter Kit (launch course)

Module order deliberately puts money before outreach:

0. **Start Here** (FREE preview) — what this is, what you'll build, full tool/cost stack setup (Claude Code, GitHub, Cloudflare, ~monthly cost), installing the kit skills/prompts
1. **Basics** — design skills, the 5-opinion council validation method, 21st.dev components, Magic-UI MCPs, the core Claude prompt library
2. **Your Offer & Pricing** — done-for-you monthly retainer model, what to charge, packaging, anchoring vs Checkatrade/per-lead
3. **Niche & Territory** — who to target, region selection, the dated-site + 07-mobile qualification bar
4. **Create Your Main Website** — your own agency site as proof-of-skill
5. **Create Demos** — the swap-and-send mockup system, demo-as-portfolio
6. **Scrape Leads with Claude** — lead sheets, qualification rules, verification off the live site
7. **Cold Outreach** — cold calling, cold DM, cold email; scripts + real examples; **UK legal module (TPS/CTPS screening, PECR for email, GDPR for lead data)**
8. **Follow-up & Pipeline** — cadence, lead sheet as CRM, objection handling
9. **Closing the Deal** — the booked call → paid client playbook
10. **Fulfilment** — onboarding checklist, building the real site, client DNS/domain, go-live, handover
11. **Getting Paid** — invoicing, deposits, GoCardless direct debit for retainers, one-page contract template
12. **Retention & Upsells** — monthly ritual, churn defence, the upsell ladder (SEO blogs add-on → cross-sells Course 2)
13. **Case Study** — one real lead followed end-to-end: scrape → call → demo → close → live site

**v2 roadmap (sell as "free updates"):** advanced automations, the mockup→email→Gmail pipeline, admin dashboard, white-label AI receptionist, scaling past 10 clients.

### 2.3 Course 2 — SEO Automation Kit (ship 4–6 weeks after launch)

0. **Start Here** (FREE preview) — the GEO thesis, what a content asset is worth, expectation timeline (weeks 1–6 = silence; kills refund risk)
1. **Foundations** — buying the domain, DNS, Cloudflare Pages, folder organisation/repo structure
2. **Technical Base** — sitemap.xml, robots.txt, llms.txt, canonicals, favicon/OG, JSON-LD schema (Article/FAQ/LocalBusiness)
3. **Design & Templates** — blog/site styles, the post template, example blogs
4. **Keyword & Content Strategy** — buyer-intent keyword banks, question mining, matching ambition to domain age
5. **Warming a New Domain** — cadence rules by domain age, week 1+ planning, the /week-plan method
6. **The Writing System** — GEO/citation-first writing, answer-shaped headings, anti-slop rules, the /blog-day style pipeline
7. **Architecture & Internal Linking** — pillar/cluster, orphan-post audits, every post feeds an older one
8. **Indexing & Measurement** — GSC + Bing Webmaster setup, IndexNow, sitemap submission, reading the data weekly
9. **Monetisation** — the three exits: funnel to your services / affiliate / sell it as a client add-on (£80-per-4-weeks Local Reach model)
10. **Case Study** — one post from keyword → published → indexed → cited by an AI engine

**v2:** programmatic town×service pages, backlinks/digital PR, Google Business Profile, multi-domain portfolio.

---

## PART 3 — THE REDESIGN ("textbook productive learning", Skool-style)

### 3.1 Direction

Flip from dark-AI-SaaS to **warm, light, academic-but-modern**. The feeling: a beautiful printed workbook you actually want to finish. Skool's lessons to steal: light UI, card-per-module, visible progress %, checkbox satisfaction, zero clutter. What we do better than Skool: typographic character (textbook serif) instead of their generic sans.

**Dials:** VARIANCE 4 / MOTION 3 / DENSITY 4. Calm and readable beats clever.

### 3.2 Colour system (psychology-driven, oklch)

| Token | Colour | Psychology / role |
|---|---|---|
| `--paper` | warm cream `oklch(0.97 0.01 90)` | paper/textbook base — low eye strain, "sit down and read" |
| `--ink` | near-black navy `oklch(0.24 0.02 260)` | authority, print-like text (never pure #000) |
| `--highlight` | highlighter yellow `oklch(0.9 0.16 95)` | THE brand accent — the highlighter pen; attention + memory association; used for marks, active states, CTA fills |
| `--progress` | green `oklch(0.65 0.15 150)` | achievement only: checkmarks, progress bars, "completed" — the dopamine loop |
| `--trust` | study blue `oklch(0.55 0.12 250)` | links, info callouts, payment/checkout surfaces (trust colour where money moves) |
| `--warn` | soft coral (sparse) | "don't do this" callouts only |
| `--panel` | white `oklch(0.995 0.005 90)` | cards on the cream base |

Rule: yellow = act, green = done, blue = learn/trust, coral = avoid. Never mix roles.

### 3.3 Typography

- **Display / chapter headings:** Fraunces (textbook serif with warmth; old-schoolbook authority without being dusty)
- **Body:** Source Sans 3 or Public Sans (humanist, long-form readable)
- **Mono (prompts, code, terminal blocks):** JetBrains Mono — the course teaches Claude prompts, so mono blocks styled like "worksheet answer boxes" become a signature element

### 3.4 Signature components (the "school" motifs — used with restraint)

- **Chapter cards** with oversized serif numerals (01, 02…) — module grid on the course home
- **Lesson checkboxes** that tick with a small satisfying transition (progress writes to the existing `done` state)
- **Highlighter marks** on key sentences (CSS background-skew, like a real highlighter swipe)
- **Sticky-note callouts** for tips; ruled-paper subtle background texture on lesson content only
- **Index tabs** on the sidebar (module = tab, like a divider in a ring binder)
- **Progress ring** ("Course 62% complete") top of sidebar + per-module bars
- Prompt blocks presented as **tear-out worksheet cards** with a copy button

Anti-slop guardrails still apply: no purple-blue gradients, no emoji icons (Lucide SVG), no Inter display, `prefers-reduced-motion` respected, 4.5:1 contrast on cream.

### 3.5 Per-page treatment

- **`/` Landing** — full rebuild as the sales page: hook ("the exact system behind a running UK web agency") → curriculum as a visual "table of contents" spread → real receipts (lead sheet, demo before/after, GSC screenshots) → who it's for/not for → pricing (2 cards: Kit / Bundle) → FAQ → free-preview CTA. Copy tone: anti-guru, receipts over hype.
- **`/course`** — keep the entire engine; reskin sidebar → ring-binder tabs, content → paper sheet, video zone stays.
- **`/account`** — strip credits/top-ups/pricing table; keep purchase card ("Unlock the full course"), transactions, profile.
- **`/auth`** — reskin to match.
- **`/legal`** — rewrite for digital-course terms: refund policy (14-day UK distance selling with digital-content waiver on access), licence (personal use, no resale/redistribution of the materials).

---

## PART 4 — TRANSITION MAP (phased, in order)

### Phase 0 — Protect what exists (½ day)
- [ ] Branch: `git checkout -b pivot-agency-course`; tag current state `v1-aimodels`
- [ ] Export Supabase `course_content` rows to `archive/` (offer to Ethan), then plan wipe
- [ ] Run gitleaks on the repo; rotate anything dirty; confirm `.env` never committed
- [ ] Decide D1–D4 (below)

### Phase 1 — Strip the old product (½ day)
- [ ] Remove/park `BAMStudio.html`, `BAMDreamPrint.html`, `Content Generation*/`, `api/keys.js`
- [ ] Remove `topup_*` from `PRICE_MAP` and `CREDIT_MAP`; remove credit UI from Account
- [ ] Remove `/studio` rewrite from `vercel.json` + `server.js`

### Phase 2 — Design system (1 day)
- [ ] Rewrite `global.css` tokens to the Part 3 system (oklch, fonts, new components)
- [ ] Build a one-page style sheet (`/styleguide.html`, unlinked) to sign off the look before touching pages

### Phase 3 — Pages (2–3 days)
- [ ] Rebuild Landing as the sales page
- [ ] Reskin Course.html (engine untouched — CSS + small markup edits only)
- [ ] Simplify + reskin Account; reskin Auth; rewrite Legal

### Phase 4 — Backend adjustments (½ day)
- [ ] Rename product semantics: `beginner` → agency kit, `advanced` → bundle (update Stripe product names/descriptions in dashboard; price IDs and amounts unchanged)
- [ ] **Fix `course_access` for multi-course future:** move to (`user_id`, `product`) composite or additive tiers — do it now while there are no real customers to migrate
- [ ] Tighten CORS to the production domain
- [ ] Update webhook copy/logs; test end-to-end in Stripe test mode

### Phase 5 — Content load (the long pole — 1–2 weeks, parallelisable)
- [ ] Write Course 1 modules 0–13 as lesson blocks via founder editor (or seed `course_content` JSON directly)
- [ ] Record/attach videos where needed (video zone already exists; text-first lessons are fine for launch)
- [ ] Free-preview module polished hardest — it IS the funnel
- [ ] Sanitise every real example (client names, lead data, keys) before it goes in a lesson

### Phase 6 — Launch checklist
- [ ] Stripe live-mode webhook endpoint verified; test purchase → access grant → refund path
- [ ] SEO basics on landing (this site is PUBLIC now, unlike the old hidden-kit plan): title/meta/OG image, sitemap, robots
- [ ] Analytics (cookieless, like the sitework funnel tracker)
- [ ] Legal page live before first sale
- [ ] Distribution plan switched on (organic posts → tweet-style ads → retargeting, per the earlier ads discussion)

### Post-launch
- SEO Automation Kit content (Phase 5 repeat) + standalone Stripe price + access logic already ready from Phase 4
- v2 modules as free updates (each update email = a sales touch)

---

## PART 5 — DECISIONS NEEDED (D1–D4)

- **D1 — Studio:** delete, or park unlinked at `/studio` behind founder auth? (Recommend: park in a branch, remove from prod — dead code with API keys is risk surface.)
- **D2 — Ethan:** founder-auth supports two founders. Is he part of the new course business? Affects revenue split, founder editor access, and whether the old course content is archived for him.
- **D3 — Brand:** "BuildAIModels" no longer describes the product. Options: (a) keep domain, reframe copy ("build an AI-powered agency"), (b) keep domain short-term + redirect to a better domain later, (c) rebrand now. Recommend (a) for speed — the AI angle is honest: the whole method is Claude-powered.
- **D4 — Exact prices:** confirm the £ amounts on the `beginner`/`advanced` price IDs in the Stripe dashboard match what you want to charge (kit ~£99, bundle ~£179 was the earlier council recommendation). Same-price reuse is fine if they're close; creating fresh prices on the same products is 5 minutes if not.

---

## PART 6 — WHAT THIS SAVES YOU

Building this from zero: auth + payments + webhook + access gating + an editable LMS ≈ 2–3 weeks of work. All of it exists and is tested. The pivot is genuinely: **strip the Studio, reskin three pages, rebuild one landing page, write the content.** The content is the product; everything else is already standing.

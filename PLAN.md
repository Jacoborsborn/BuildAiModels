# BAM Multi-Page Website Conversion Plan

Goal: convert buildaimodels.co.uk from a single landing page into a premium multi-page
site, keeping the existing "Study Hall" design system (global.css) so everything stays
coherent. Each page must stand alone as a strong, conversion-focused page.

## Page structure (vercel.json rewrites)

| URL | File | Status |
|---|---|---|
| `/` | BAMLanding.html | REWORK — tighter premium home, hero rebuilt, curriculum section → "What's Included" teaser linking to the full page |
| `/about` | About.html | NEW — adapted from sitework.uk/about (my own agency). Founder story, portrait photo, values, CTA |
| `/whats-included` | WhatsIncluded.html | NEW — replaces "Curriculum" concept. Full breakdown: 14 modules, prompt library, scripts, lead sheets, templates, SEO kit |
| `/pricing` | Pricing.html | NEW — dedicated service/landing page for the £99 / £179 offers, objection handling, FAQ, refund terms |
| `/auth` `/account` `/legal` `/course` `/waitlist` | existing | Nav/footer updated only |
| `/blog/` | existing | Nav already separate; leave content |

## Assets
- Copy portrait `Website Sales/assets/about/about-e-web.jpg` → `assets/about/jacob.jpg`
  (same image used on sitework.uk about page — my own photo).

## Nav (all pages, consistent)
Logo · What's Included · Pricing · About · Blog · Sign in · [Start free preview]

## Copy direction (from the 9 prompts)
- **Home**: hero that lands in 3 seconds — headline + subhead + single CTA; problem →
  solution → proof (receipts strip) → What's Included teaser → who it's for → pricing
  teaser → FAQ → final CTA.
- **About**: brand-storytelling structure from sitework about page, adapted to BAM:
  "the course is the documented playbook of my real agency" angle. Portrait + founder
  sign-off + how-I-work values + CTA.
- **What's Included**: value-driven inventory. Modules grouped into phases (Foundations /
  Get Clients / Deliver & Get Paid / Grow), plus the non-module assets (prompt library,
  scripts, lead sheet, contract, lifetime updates). Every group ends in benefit language.
- **Pricing**: headline for ideal buyer, value framing (what an agency site costs vs the
  kit), both tiers, trust props (free module, 14-day refund, one-time payment), booking-
  style CTA.
- **Mobile UX**: single-column stacks under 900px, thumb-sized CTAs, sticky nav kept,
  reveal animations honour prefers-reduced-motion.

## SEO/meta
- Unique title/description/OG/canonical per page.
- Update sitemap.xml with new URLs; keep llms.txt in sync.

## Order of work — ALL DONE (2026-07-09)
1. ✅ PLAN.md (this file)
2. ✅ Copy about image into assets/about/
3. ✅ About.html
4. ✅ WhatsIncluded.html
5. ✅ Pricing.html
6. ✅ Rework BAMLanding.html (hero + section links to new pages, curriculum → What's Included teaser)
7. ✅ vercel.json rewrites + nav/footer sweep across BAMAuth, BAMAccount, BAMLegal, Course, Waitlist, blog/index
   — plus all 5 blog posts: old `/#curriculum` / `/#pricing` navs and in-content links now point at
   /whats-included and /pricing, footers standardised to the full link set
8. ✅ sitemap.xml (added /whats-included, /pricing, /about) + llms.txt (regenerated with new key pages)
9. ✅ Verified in preview — all routes 200, no console errors, navs consistent, no stale anchor links

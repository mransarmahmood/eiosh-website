# EIOSH Global — Next.js website

A production-grade marketing and qualifications site for **EIOSH Global**, an
international training and certification preparation organisation and approved
centre for IOSH, OSHAcademy, OSHAwards, HABC, OTHM and IEMA.

Stack:

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS 3** with a custom token system (navy / cyan / gold)
- **Framer Motion** for refined micro-interactions
- **shadcn/ui-compatible** primitive layer (own UI kit, no runtime lock-in)
- CMS-ready for **Sanity** or **Strapi** — schemas in `cms/`
- i18n-ready (English default, Arabic locale scaffolded)
- SEO-ready: per-page metadata, JSON-LD, sitemap, robots

---

## Quick start

```bash
cd eiosh-next
cp .env.example .env.local
npm install
npm run dev
```

Site runs at http://localhost:3000.

---

## Project structure

```
eiosh-next/
├─ app/
│  ├─ layout.tsx               # Root layout: header, footer, sticky CTAs
│  ├─ page.tsx                 # Homepage
│  ├─ globals.css              # Tailwind base + brand tokens
│  ├─ robots.ts, sitemap.ts    # SEO
│  ├─ not-found.tsx            # 404
│  ├─ api/inquiry/route.ts     # Inquiry endpoint (forwards to webhook)
│  └─ (marketing)/
│     ├─ about/
│     ├─ courses/              # List + [slug] dynamic detail
│     ├─ certification-preparation/
│     ├─ awarding-bodies/
│     ├─ corporate-training/
│     ├─ trainers/
│     ├─ blog/                 # List + [slug]
│     ├─ events/
│     ├─ testimonials/
│     ├─ faq/
│     ├─ contact/
│     ├─ verify-certificate/
│     ├─ student-services/
│     ├─ policies/
│     └─ partnership/
├─ components/
│  ├─ layout/                  # Header, MegaMenu, MobileNav, Footer, sticky CTAs, WhatsApp
│  ├─ sections/                # Homepage & reusable marketing sections
│  ├─ cards/                   # CourseCard, TrainerCard, BlogCard, TestimonialCard
│  ├─ forms/                   # Inquiry, Newsletter, Certificate verification
│  ├─ filters/                 # CourseFilters (client-side, URL-ready)
│  └─ ui/                      # Button, Badge, Input, Container, SectionHeading, Logo
├─ content/                    # Seed data (swap for CMS queries)
├─ cms/                        # Sanity & Strapi schema documentation
├─ lib/                        # Utils, types, i18n, SEO helpers
├─ locales/                    # en.json / ar.json UI strings
├─ public/brand/               # Logo & OG assets (drop-in)
└─ tailwind.config.ts          # Brand tokens
```

### Architectural principles

1. **Content is decoupled.** Every page reads from `content/*.ts`. Replace those
   imports with Sanity/Strapi queries and types still hold.
2. **Types first.** `lib/types.ts` is the source of truth; the CMS schemas in
   `cms/` are written to serialise cleanly onto those types.
3. **One design system.** Brand tokens live in `tailwind.config.ts`. Every
   component uses named utility classes, so theme changes are one-file edits.
4. **A11y as default.** Focus-visible rings, skip link, ARIA on mega menu & FAQ,
   `prefers-reduced-motion` respected, 44×44 touch targets, semantic headings.
5. **Arabic-ready.** `direction()` helper in `lib/i18n.ts` — when you move to
   `app/[locale]/*`, the body `dir` attribute and Arabic font stack are already
   wired in `globals.css`.

---

## Design system

| Token | Value | Usage |
|-------|-------|-------|
| `navy-950` | `#0A1F44` | Primary brand, page backgrounds on dark sections |
| `cyan-500` | `#1FB6E0` | Brand accent, links, icons |
| `gold-400` | `#D4A017` | **Reserved for the single top-of-funnel CTA per page** |
| `ink` | `#0F172A` | Body text |
| `ink-muted` | `#475569` | Secondary text |
| `surface-subtle` | `#F8FAFC` | Alternating section background |

**Typography:** Lexend (headings) + Source Sans 3 (body) — Corporate Trust
pairing with excellent accessibility. Pre-loaded from Google Fonts in
`globals.css`.

**Motion:** short enter animations (≤280ms) via Framer Motion; all animations
honour `prefers-reduced-motion`.

---

## CMS migration

The site is ready to swap from `content/*` static files to a headless CMS.

- **Sanity** — see [`cms/sanity.schemas.md`](cms/sanity.schemas.md)
- **Strapi** — see [`cms/strapi.schemas.md`](cms/strapi.schemas.md)

Both documents ship 12 schemas that map 1:1 to `lib/types.ts`.

### Recommended migration order

1. `siteSettings` + `accreditation` + `courseCategory` (least interdependent)
2. `trainer` + `course` (course references category + awardingBody)
3. `testimonial`, `blogPost`, `event`, `faq`
4. `page`, `download`, `inquiry` (admin-only)
5. Swap each homepage section's `content/*` import for a server-side query
6. Turn on ISR with `revalidate: 300`

---

## SEO

- `lib/seo.ts` generates per-page `Metadata` with canonical URL, OG, Twitter
  and alternate-language tags (`en-GB` + `ar-SA`).
- Root layout injects `Organization` JSON-LD.
- `app/sitemap.ts` generates a combined static + dynamic sitemap from the
  courses and blog content collections.
- `app/robots.ts` allows all and points at the sitemap.

---

## Forms

- `InquiryForm` → `/api/inquiry` → `process.env.INQUIRY_WEBHOOK_URL`
  (Zapier, Make, HubSpot, Salesforce). Validated with Zod.
- `NewsletterForm` is client-side only; wire to your ESP by replacing the stub.
- `CertificateVerifyForm` returns deterministic demo data for references
  starting `EIOSH-`. Replace with your real verification API.

---

## Conversion rate optimisation checklist

- [x] Single, visible primary CTA above the fold (Explore qualifications)
- [x] Trust strip with awarding-body names in-line with hero
- [x] Price-from shown on every course card (no hidden pricing)
- [x] Sticky enrolment card on course detail
- [x] Three-way mobile CTA bar (Call / WhatsApp / Enrol)
- [x] Social proof: stats band + testimonials slider on home and about
- [x] Frictionless inquiry form (6 fields, consent in line)
- [x] No dark patterns; unsubscribe promised in newsletter copy

---

## Accessibility

- Skip-to-content link is the first tab stop
- All interactive elements have `cursor-pointer` and visible focus rings
- Text contrast ≥ 4.5:1 on all surfaces; verified against brand palette
- Icons always paired with text or have `aria-label`
- FAQ accordion and mega menu are keyboard navigable; Escape closes panels
- `prefers-reduced-motion` respected in `globals.css`

---

## Future work

- Replace seed content with Sanity/Strapi queries
- Add `/ar/*` route segment for Arabic locale
- Connect newsletter form to your ESP (Mailchimp / HubSpot / Substack)
- Wire `/api/inquiry` → your CRM webhook
- Add real imagery to `public/brand/` (logo, OG image, course heroes)
- Integrate analytics (GA4 / PostHog — env vars provided)

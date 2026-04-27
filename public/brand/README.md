# Brand assets

Drop these files in when available:

- `eiosh-logo.png` (minimum 512×512, transparent background)
- `eiosh-logo-dark.png` (white-on-transparent variant for dark backgrounds)
- `eiosh-logo.svg` (vector, preferred)
- `og-default.jpg` (1200×630, used for homepage Open Graph)
- `og-{page}.jpg` (optional per-page OG overrides)
- `favicon.ico` + `icon.png` (96×96) → place directly in `/app` for Next.js icon conventions

Until these land, the site falls back to the inline SVG logo in
`components/ui/Logo.tsx`, which is derived from the EIOSH Global logo
(navy triangle + cyan ring motif).

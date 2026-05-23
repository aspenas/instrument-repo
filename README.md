# Perch — instrument architecture

Brand site and instrument-architecture page for Perch, the first instrument
in the Wake platform, built by Candlefish. The site presents the Perch brand
system (mark, lockups, color, voice) and an engineering reference that walks
through how an instrument is built — using the Tharp engagement as the worked
case study.

- **Live:** https://instruments.highline.work
- **Figma:** [Perch — Logo System](https://www.figma.com/design/Mf9QlzzVsg9mfF0Qu8ohVU)

The live surface sits behind HTTP Basic auth enforced by the Worker
(`workers/instrument-architecture/worker.js`).

## Layout

The site is a single Vite app under `workers/instrument-architecture/`. The
repo root carries supporting material: the brand-reveal video pipeline
(`scripts/`, `assets/`), the agent-runtime scaffold (`docs/`), and mobile QA
screenshots.

```
.
├── workers/instrument-architecture/   # the site (React + Vite + Cloudflare Worker)
│   ├── src/                           # App.tsx, main.tsx, index.css, fonts.css
│   ├── public/brand/                  # brand assets (SVG, PNG, PDF, favicons)
│   ├── dist/                          # build output (gitignored; Worker serves it)
│   ├── worker.js                      # Worker entry — Basic-auth gate + static-asset serving
│   ├── wrangler.toml                  # Cloudflare config
│   └── package.json                   # scripts + dependencies
├── scripts/                           # brand-reveal video render + audio mix
├── assets/                            # brand source assets and reveal video
└── docs/agent-runtime/                # compact Codex/Claude handoff scaffold
```

## Stack

- React 19, TypeScript, Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- GSAP and Lenis for scroll animation
- Self-hosted fonts via Fontsource (DM Sans, JetBrains Mono, Instrument Serif,
  Caveat, Permanent Marker)
- Cloudflare Workers with static-asset serving

## Develop

```bash
cd workers/instrument-architecture
npm install
npm run dev          # Vite dev server with HMR
```

Other scripts (run from `workers/instrument-architecture/`):

```bash
npm run build        # tsc -b && vite build  →  dist/
npm run lint         # eslint
npm run preview      # serve the production build locally
npm run qa:local     # build, then run the local visual-audit
npm run qa:live      # visual-audit against the live site
```

## Deploy

Deploy target is Cloudflare Workers — the `instrument-architecture` Worker on
the `highline.work` zone, routed at `instruments.highline.work/*`. The Worker
runs `npm run build` and serves `dist/` through its `ASSETS` binding.

```bash
cd workers/instrument-architecture
npm run deploy       # wrangler deploy
```

Wrangler authenticates via the Cloudflare credentials in the environment. See
`~/Work/.claude/rules/cloudflare-admin.md` for the highline-account token paths.

## Brand assets

Brand assets live in `workers/instrument-architecture/public/brand/` and are
served under `/brand/*` on the live site.

| Asset | Route |
|-------|-------|
| Mark (dark surface) | `/brand/perch-mark.svg` |
| Mark (light surface) | `/brand/perch-mark-light.svg` |
| Mark (white) | `/brand/perch-mark-white.svg` |
| Lockup horizontal (light) | `/brand/perch-lockup-horizontal.svg` |
| Lockup horizontal (dark) | `/brand/perch-lockup-horizontal-dark.svg` |
| Clearspace | `/brand/perch-clearspace.svg` |
| Design lineage | `/brand/design-lineage.svg` |
| Typography specimen | `/brand/typography-specimen.svg` |
| Color swatches | `/brand/color-swatches.svg` |
| Voice card specimens | `/brand/voice-card-{briefing,anomaly,cashflow}.svg` |
| Brand system PDF | `/brand/logo-system-v5.pdf` |

## Brand-reveal video

`scripts/` carries the Perch brand-reveal render pipeline (`render-brand-reveal-v11.py`,
`build-cacophony.sh`, `mix-audio-v11.sh`). Rendered output and source media
live under `assets/`. These are kept in the repo but are independent of the
site build.

## Agent runtime

`docs/agent-runtime/` holds the compact Codex/Claude handoff scaffold
(`current.md`, `known-drift.md`, `ledger.md`) plus machine-checkable contracts
in `docs/contracts/`. Validate before changing source-backed claims:

```bash
python scripts/validate_agent_runtime.py --offline
```

`FLAG` items reflect known drift; `FAIL` means a source-backed contract has
broken.

## Status

The site is live at `instruments.highline.work` and behind Basic auth. The
brand system and the architecture page are both built. The architecture page
documents Perch as implemented for the Tharp engagement; keep its references in
sync with the Wake architecture chapters at `architecture.highline.work`
(source under `~/Work/wake/architecture/`) when those move.

## License

Proprietary. Copyright (c) 2026 Candlefish.ai LLC. All rights reserved. See
`LICENSE`.

# Perch — Instrument Architecture

Brand and architecture site for Perch, the first instrument in the Wake platform.

**Live:** https://instruments.highline.work  
**Figma:** [Perch — Logo System](https://www.figma.com/design/Mf9QlzzVsg9mfF0Qu8ohVU)

## Setup

```bash
cd workers/instrument-architecture
npm install
npm run dev
```

## Deploy

```bash
cd workers/instrument-architecture
CLOUDFLARE_API_TOKEN=$CLOUDFLARE_HIGHLINE_API_TOKEN npx wrangler deploy
```

## Stack

- React 19, TypeScript, Vite 8
- Tailwind CSS 4
- Cloudflare Workers (static assets)

## Structure

```
workers/instrument-architecture/
├── src/
│   ├── App.tsx          # Page component
│   ├── index.css        # Styles
│   ├── main.tsx         # Entry
│   └── fonts.css        # Self-hosted fonts
├── public/brand/        # Brand assets (SVG, PNG, PDF)
├── wrangler.toml        # Cloudflare config
└── worker.js            # Worker entry
```

## Brand assets

Served at `/brand/*` on the live site.

| Asset | Route |
|-------|-------|
| Mark (dark bg) | `/brand/perch-mark.svg` |
| Mark (light bg) | `/brand/perch-mark-light.svg` |
| Lockup horizontal (light) | `/brand/perch-lockup-horizontal.svg` |
| Lockup horizontal (dark) | `/brand/perch-lockup-horizontal-dark.svg` |
| Clearspace | `/brand/perch-clearspace.svg` |
| Design lineage | `/brand/design-lineage.svg` |
| Brand system PDF | `/brand/logo-system-v5.pdf` |

## Figma nodes

| Node | Description |
|------|-------------|
| `12:3` | Primary Lockup — Dark |
| `12:20` | Primary Lockup — Light |
| `12:36` | Horizontal Lockup — Dark |
| `12:56` | Horizontal Lockup — Light |
| `12:77` | Icon — Dark |

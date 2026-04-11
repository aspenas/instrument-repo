# Perch Premium Quality Stack

This repo now includes a repeatable quality lane for the Perch site so visual decisions do not rely on memory, manual shell snippets, or geometry reconstruction.

## What changed

- Brand typography is self-hosted through `@fontsource` packages for deterministic rendering.
- Browser QA is handled by Playwright, not code-only inspection.
- The audit covers both the landing page and the direct `/brand/*` routes.
- The audit checks dark, light, and mobile states for the home page.

## Commands

- `npm run qa:browsers`
  Installs Chromium for the local audit lane.

- `npm run qa:local`
  Starts a local preview server, captures the Perch page plus brand routes, writes artifacts to `artifacts/visual-audit/local`, and shuts the preview server down.

- `npm run qa:live`
  Captures the same visual set against `https://instruments.highline.work/` and writes artifacts to `artifacts/visual-audit/live`.

- `npm run qa:build`
  Rebuilds the app and then runs the full local audit.

## Operating rules

- Figma remains the source of truth for Perch geometry.
- Do not redraw or “clean up” fish geometry by hand.
- Verify the hero, both themes, and the direct brand routes before deploy.
- If a refinement improves only one theme, it is not done yet.
- Keep the page reading like an editorial product surface, not a stack of cards.

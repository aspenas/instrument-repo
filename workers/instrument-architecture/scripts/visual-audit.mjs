import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium, devices } from '@playwright/test'

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.split('=')
    return [key, value ?? '']
  }),
)

const baseUrl = (args.get('--base-url') ?? 'http://127.0.0.1:4173').replace(/\/$/, '')
const outputDir = path.resolve(args.get('--output-dir') ?? 'artifacts/visual-audit/local')

const desktop = { width: 1600, height: 1400 }
const mobile = devices['iPhone 14']

const pageShots = [
  { name: 'home-dark', path: '/', theme: 'dark', viewport: desktop },
  { name: 'home-light', path: '/', theme: 'light', viewport: desktop },
  { name: 'home-mobile-dark', path: '/', theme: 'dark', device: mobile },
  { name: 'home-mobile-light', path: '/', theme: 'light', device: mobile },
]

const brandShots = [
  {
    name: 'brand-mark-dark',
    assetPath: '/brand/perch-mark.svg',
    background: '#060708',
    viewport: { width: 1400, height: 900 },
  },
  {
    name: 'brand-mark-light',
    assetPath: '/brand/perch-mark-light.svg',
    background: '#f2eee7',
    viewport: { width: 1400, height: 900 },
  },
  {
    name: 'brand-lockup-light',
    assetPath: '/brand/perch-lockup-horizontal.svg',
    background: '#f2eee7',
    viewport: { width: 1600, height: 900 },
  },
  {
    name: 'brand-lockup-dark',
    assetPath: '/brand/perch-lockup-horizontal-dark.svg',
    background: '#060708',
    viewport: { width: 1600, height: 900 },
  },
  {
    name: 'brand-clearspace',
    assetPath: '/brand/perch-clearspace.svg',
    background: '#111315',
    viewport: { width: 1400, height: 1100 },
  },
  {
    name: 'brand-lineage',
    assetPath: '/brand/design-lineage.svg',
    background: '#050607',
    viewport: { width: 1600, height: 1100 },
  },
]

const reports = []

function resolveUrl(route) {
  return new URL(route, `${baseUrl}/`).href
}

async function capturePageShot(browser, shot) {
  const context = shot.device
    ? await browser.newContext({
        ...shot.device,
        colorScheme: shot.theme,
      })
    : await browser.newContext({
        viewport: shot.viewport,
        colorScheme: shot.theme,
      })

  const page = await context.newPage()
  await page.addInitScript((theme) => {
    window.localStorage.setItem('perch-theme', theme)
  }, shot.theme)
  await page.goto(resolveUrl(shot.path), { waitUntil: 'networkidle' })
  await page.waitForSelector('.hero')

  const outputPath = path.join(outputDir, `${shot.name}.png`)
  await page.screenshot({ path: outputPath, fullPage: true })
  reports.push({ type: 'page', ...shot, outputPath })
  await context.close()
}

async function captureBrandShot(browser, shot) {
  const context = await browser.newContext({ viewport: shot.viewport })
  const page = await context.newPage()
  const assetUrl = resolveUrl(shot.assetPath)

  await page.setContent(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>
          :root { color-scheme: dark; }
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: ${shot.background};
            padding: 48px;
          }
          img {
            display: block;
            max-width: min(100%, 1320px);
            max-height: calc(100vh - 96px);
            object-fit: contain;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
          }
        </style>
      </head>
      <body>
        <img id="asset" src="${assetUrl}" alt="" />
      </body>
    </html>
  `)

  await page.waitForFunction(() => {
    const img = document.getElementById('asset')
    return img instanceof HTMLImageElement && img.complete
  })

  const outputPath = path.join(outputDir, `${shot.name}.png`)
  await page.screenshot({ path: outputPath, fullPage: true })
  reports.push({ type: 'asset', ...shot, assetUrl, outputPath })
  await context.close()
}

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch()

try {
  for (const shot of pageShots) {
    await capturePageShot(browser, shot)
  }

  for (const shot of brandShots) {
    await captureBrandShot(browser, shot)
  }
} finally {
  await browser.close()
}

const reportPath = path.join(outputDir, 'report.json')
await writeFile(
  reportPath,
  `${JSON.stringify(
    {
      baseUrl,
      generatedAt: new Date().toISOString(),
      reports,
    },
    null,
    2,
  )}\n`,
)

console.log(`Visual audit complete for ${baseUrl}`)
console.log(`Artifacts written to ${outputDir}`)
console.log(`Report: ${reportPath}`)

import { useEffect, useState } from 'react'
import { ArrowUpRight, MoonStar, SunMedium } from 'lucide-react'

type Theme = 'dark' | 'light'

const principles = [
  {
    title: 'Interpreted before it arrives',
    body: 'Perch delivers the operator read already formed — what moved, why it matters, and where to look next. No dashboards to interpret. No alerts to triage.',
  },
  {
    title: 'Calm enough to trust',
    body: 'The surface should feel measured, legible, and free of theatrical UI. If the design competes with the content, the instrument has failed.',
  },
  {
    title: 'Own species, shared language',
    body: 'Candlefish owns the scope and the left-facing parent mark. Perch inherits the visual language, turns right, and warms the accent to teal.',
  },
]

const rules = [
  {
    label: '01',
    title: 'Instrument, not agent',
    body: 'Always describe Perch as an instrument by Wake, built by Candlefish. It is operational software, not an autonomous persona.',
  },
  {
    label: '02',
    title: 'Direction carries meaning',
    body: 'Perch faces right. Candlefish faces left. That directional split is part of the lineage language and cannot drift.',
  },
  {
    label: '03',
    title: 'Scope belongs to Candlefish',
    body: 'The crosshair scope stays with the parent company mark. Perch never inherits it on external-facing surfaces.',
  },
  {
    label: '04',
    title: 'Accent is intentional',
    body: 'Use #4A9BA8 for the eye, the period in Perch., and interactive emphasis. Everything else stays restrained.',
  },
]

const techSpec = [
  { label: 'Classification', value: 'Instrument (not agent, not dashboard)' },
  { label: 'Attribution', value: 'instrument by Wake · built by Candlefish' },
  { label: 'Platform', value: 'Wake' },
  { label: 'Parent', value: 'Candlefish' },
  { label: 'Accent', value: '#4A9BA8' },
  { label: 'Direction', value: 'Perch faces right · Candlefish faces left' },
  { label: 'Eye', value: 'Filled circle — never hollow, never scoped' },
  { label: 'Scope', value: 'Candlefish only — never applied to Perch' },
]

const techAssets = [
  { label: 'Mark (dark bg)', path: '/brand/perch-mark.svg' },
  { label: 'Mark (light bg)', path: '/brand/perch-mark-light.svg' },
  { label: 'Lockup horizontal (light)', path: '/brand/perch-lockup-horizontal.svg' },
  { label: 'Lockup horizontal (dark)', path: '/brand/perch-lockup-horizontal-dark.svg' },
  { label: 'Clearspace reference', path: '/brand/perch-clearspace.svg' },
  { label: 'Design lineage', path: '/brand/design-lineage.svg' },
  { label: 'Color swatches', path: '/brand/color-swatches.svg' },
  { label: 'Brand system PDF', path: '/brand/logo-system-v5.pdf' },
]

const techTypography = [
  { role: 'Display', family: 'Instrument Serif', weight: '400', usage: 'Hero, section headings, editorial statements' },
  { role: 'Body', family: 'DM Sans', weight: '400–500', usage: 'Paragraphs, descriptions, UI text' },
  { role: 'Mono', family: 'JetBrains Mono', weight: '500', usage: 'Labels, attribution, technical metadata' },
]

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('perch-theme') as Theme | null
    const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    return stored ?? preferred
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('perch-theme', theme)
  }, [theme])

  const heroMarkSrc = theme === 'light' ? '/brand/perch-mark-hero-light.svg' : '/brand/perch-mark-hero-dark.svg'
  const lockupSrc = theme === 'light' ? '/brand/perch-lockup-horizontal-nobg.svg' : '/brand/perch-lockup-horizontal-dark-nobg.svg'

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <button
        type="button"
        aria-label="Toggle color theme"
        onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        className="theme-toggle"
      >
        {theme === 'dark'
          ? <SunMedium className="icon" aria-hidden="true" />
          : <MoonStar className="icon" aria-hidden="true" />}
      </button>

      <main id="main">
        {/* ──── Hero ──── */}
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Perch<span className="accent">.</span></h1>
            <p className="hero-attr">instrument by Wake&ensp;·&ensp;built by Candlefish</p>
          </div>
          <img
            src={heroMarkSrc}
            alt=""
            width={288}
            height={216}
            className="hero-mark"
            aria-hidden="true"
          />
        </section>

        {/* ──── Instrument ──── */}
        <section className="instrument">
          <div className="instrument-header">
            <h2 className="display-heading">
              Financial intelligence that already feels understood.
            </h2>
            <p className="instrument-desc">
              A calm operator read for businesses that do not have a finance
              department — what moved, why it matters, and where to look next.
            </p>
          </div>

          <div className="principles">
            {principles.map((p) => (
              <div key={p.title} className="principle">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ──── Brand ──── */}
        <section id="brand" className="brand">
          <div className="brand-header">
            <p className="section-label">Brand system</p>
            <h2 className="section-heading">Shown correctly on both surfaces.</h2>
          </div>

          <div className="surfaces">
            <div className="surface surface--light">
              <img
                src="/brand/perch-lockup-horizontal-nobg.svg"
                alt="Perch horizontal lockup on light surface"
                width={536}
                height={162}
                loading="lazy"
              />
            </div>
            <div className="surface surface--dark">
              <img
                src="/brand/perch-lockup-horizontal-dark-nobg.svg"
                alt="Perch horizontal lockup on dark surface"
                width={536}
                height={162}
                loading="lazy"
              />
            </div>
          </div>

          <div className="rules">
            {rules.map((r) => (
              <div key={r.label} className="rule">
                <span className="rule-num">{r.label}</span>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──── Voice ──── */}
        <section className="voice">
          <div className="voice-header">
            <p className="section-label">Voice</p>
            <h2 className="section-heading">Perch should read like operating intelligence.</h2>
            <p className="voice-desc">
              Not a dashboard caption. Not a chatbot persona. A trusted operator
              read — steady, specific, and free of filler.
            </p>
          </div>

          <div className="voice-specimen">
            <figure className="specimen-figure">
              <img
                src="/brand/voice-card-briefing.svg"
                alt="Perch weekly owner briefing specimen"
                width={720}
                height={460}
                loading="lazy"
              />
            </figure>
            <div className="specimen-meta">
              <h3>Weekly owner briefing</h3>
              <p>
                What changed, why it changed, and what deserves attention next.
                The numbers moved — Perch tells the owner before they have to ask.
              </p>
            </div>
          </div>
        </section>

        {/* ──── Technical reference ──── */}
        <section className="tech-ref">
          <div className="tech-ref-header">
            <p className="section-label">Technical reference</p>
            <h2 className="section-heading">Perch specification.</h2>
          </div>

          <div className="tech-grid">
            <div className="tech-block">
              <h3>Identity</h3>
              <table className="tech-table">
                <tbody>
                  {techSpec.map((row) => (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tech-block">
              <h3>Typography</h3>
              <table className="tech-table">
                <tbody>
                  {techTypography.map((row) => (
                    <tr key={row.role}>
                      <td>{row.role}</td>
                      <td>
                        <strong>{row.family}</strong> {row.weight}
                        <br /><span className="tech-usage">{row.usage}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tech-block tech-block--full">
              <h3>Asset routes</h3>
              <div className="tech-assets">
                {techAssets.map((a) => (
                  <a key={a.path} href={a.path} target="_blank" rel="noreferrer" className="tech-asset-link">
                    <span>{a.label}</span>
                    <code>{a.path}</code>
                    <ArrowUpRight className="icon" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            <div className="tech-block tech-block--full">
              <h3>Figma source</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>File</td><td><a href="https://www.figma.com/design/Mf9QlzzVsg9mfF0Qu8ohVU/Perch-%E2%80%94-Logo-System" target="_blank" rel="noreferrer">Perch — Logo System</a></td></tr>
                  <tr><td>Primary lockup dark</td><td><code>12:3</code></td></tr>
                  <tr><td>Primary lockup light</td><td><code>12:20</code></td></tr>
                  <tr><td>Horizontal dark</td><td><code>12:36</code></td></tr>
                  <tr><td>Horizontal light</td><td><code>12:56</code></td></tr>
                  <tr><td>Icon dark</td><td><code>12:77</code></td></tr>
                </tbody>
              </table>
            </div>

            <div className="tech-block tech-block--full">
              <h3>Color</h3>
              <div className="tech-swatches">
                <div className="tech-swatch" style={{ background: '#4A9BA8' }}>
                  <span>#4A9BA8</span>
                  <span>Accent</span>
                </div>
                <div className="tech-swatch" style={{ background: '#0a0c0d', color: '#f7f4ef' }}>
                  <span>#0A0C0D</span>
                  <span>Dark bg</span>
                </div>
                <div className="tech-swatch" style={{ background: '#fafafa', color: '#111314', border: '1px solid #e0e0e0' }}>
                  <span>#FAFAFA</span>
                  <span>Light bg</span>
                </div>
                <div className="tech-swatch" style={{ background: '#f7f4ef', color: '#111314', border: '1px solid #e0e0e0' }}>
                  <span>#F7F4EF</span>
                  <span>Dark text</span>
                </div>
                <div className="tech-swatch" style={{ background: '#111314' }}>
                  <span>#111314</span>
                  <span>Light text</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──── Footer ──── */}
        <footer className="site-footer">
          <p className="footer-closing">Perch is the first member of the instrument&nbsp;family.</p>
          <img
            src={lockupSrc}
            alt="Perch horizontal lockup"
            width={420}
            height={108}
            className="footer-lockup"
            loading="lazy"
          />
          <div className="footer-links">
            <a href="/brand/logo-system-v5.pdf" target="_blank" rel="noreferrer">
              Brand system PDF <ArrowUpRight className="icon" aria-hidden="true" />
            </a>
            <a href="https://www.figma.com/design/Mf9QlzzVsg9mfF0Qu8ohVU/Perch-%E2%80%94-Logo-System" target="_blank" rel="noreferrer">
              Figma source <ArrowUpRight className="icon" aria-hidden="true" />
            </a>
            <a href="https://github.com/aspenas/instrument-repo" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight className="icon" aria-hidden="true" />
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}

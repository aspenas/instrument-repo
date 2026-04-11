import { useEffect, useRef, useState } from 'react'
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
    body: 'Perch is an instrument, built by Candlefish. It is operational software, not an autonomous persona.',
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


function Signature() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const penRef = useRef<SVGCircleElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || !pathRef.current || !penRef.current) return
    const path = pathRef.current
    const pen = penRef.current
    const length = path.getTotalLength()

    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    const duration = 2800
    const start = performance.now()

    function animate(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      path.style.strokeDashoffset = `${length * (1 - eased)}`

      const point = path.getPointAtLength(length * eased)
      pen.setAttribute('cx', `${point.x}`)
      pen.setAttribute('cy', `${point.y}`)
      pen.style.opacity = progress < 1 ? '1' : '0'

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [visible])

  // Real Caveat font glyph paths for "PJS" — extracted via opentype.js
  const d = 'M6.16 54.69L6.16 54.69Q5.49 54.69 5.04 53.96L5.04 53.96Q4.70 53.62 4.62 53.04Q4.54 52.45 4.98 50.91Q5.43 49.37 6.50 46.18L6.50 46.18Q7.06 44.05 7.39 43.07Q7.73 42.09 7.73 41.64L7.73 41.64Q7.73 41.02 7.87 40.60Q8.01 40.18 8.01 39.79L8.01 39.79Q8.34 39.79 8.68 39.18Q9.02 38.56 9.24 37.50L9.24 37.50Q9.46 36.54 9.66 35.96Q9.86 35.37 9.86 35.14L9.86 35.14Q10.14 34.70 10.44 33.74Q10.75 32.79 11.42 31.45L11.42 31.45Q11.87 29.77 12.43 27.95Q12.99 26.13 13.58 24.53Q14.17 22.94 14.56 22.04L14.56 22.04Q15.18 20.30 15.51 19.60Q15.85 18.90 15.51 18.68L15.51 18.68Q15.12 18.40 15.34 17.73Q15.57 17.06 16.58 16.22L16.58 16.22Q17.19 15.49 17.64 15.18Q18.09 14.87 18.79 14.87Q19.49 14.87 20.83 14.98L20.83 14.98Q21.84 15.04 23.02 15.04L23.02 15.04L24.42 15.04Q24.92 15.26 25.65 15.52Q26.38 15.77 26.96 15.99Q27.55 16.22 27.55 16.38L27.55 16.38Q27.55 16.72 27.80 16.80Q28.06 16.89 28.34 16.94L28.34 16.94Q28.73 16.94 29.40 17.53Q30.07 18.12 30.80 18.99Q31.53 19.86 31.92 20.81L31.92 20.81Q32.37 21.76 32.62 22.60Q32.87 23.44 32.59 25.01L32.59 25.01Q32.54 25.85 32.34 26.69Q32.14 27.53 31.92 27.81L31.92 27.81Q31.58 28.03 31.30 28.37Q31.02 28.70 31.02 28.98L31.02 28.98Q31.02 29.21 30.63 29.85Q30.24 30.50 29.62 31.34Q29.01 32.18 28.28 33.02Q27.55 33.86 26.88 34.47L26.88 34.47Q26.15 35.37 25.17 36.15Q24.19 36.94 23.41 37.44L23.41 37.44Q21.95 38.11 20.19 38.78Q18.42 39.46 16.83 39.90Q15.23 40.35 14.17 40.30L14.17 40.30Q12.54 40.52 12.07 40.72Q11.59 40.91 11.37 41.70L11.37 41.70Q11.09 42.42 10.84 43.18Q10.58 43.94 10.58 44.22L10.58 44.22Q10.47 44.44 10.05 45.59Q9.63 46.74 9.16 48.25Q8.68 49.76 8.23 51.22Q7.78 52.67 7.56 53.62L7.56 53.62Q7.34 54.41 7 54.55Q6.66 54.69 6.16 54.69ZM13.10 37.33L13.10 37.33Q13.33 37.55 14.84 37.38Q16.35 37.22 18.09 36.54L18.09 36.54Q19.21 36.15 20.36 35.59Q21.50 35.03 22.57 34.36L22.57 34.36Q23.13 33.97 24.25 32.96Q25.37 31.95 26.49 30.55L26.49 30.55Q26.66 30.27 27.08 29.46Q27.50 28.65 27.83 27.92L27.83 27.92Q28.34 27.14 28.84 25.60Q29.34 24.06 29.06 23.05L29.06 23.05Q28.78 21.59 27.61 20.33Q26.43 19.07 24.81 18.62L24.81 18.62Q23.58 18.40 22.76 18.40Q21.95 18.40 21 18.57L21 18.57Q20.10 18.85 19.68 19.35Q19.26 19.86 18.59 21.48L18.59 21.48Q18.20 22.26 17.47 23.86Q16.74 25.46 16.24 26.86L16.24 26.86Q15.23 30.55 14.25 32.93Q13.27 35.31 13.05 35.93L13.05 35.93Q13.10 36.54 12.99 36.80Q12.88 37.05 13.10 37.33ZM30.41 62.14L30.41 62.14Q29.46 62.58 28.25 62.50Q27.05 62.42 25.87 61.83Q24.70 61.24 23.80 60.29L23.80 60.29Q23.41 59.84 23.30 59.42Q23.18 59 23.41 58.27L23.41 58.27Q23.69 57.26 24.14 57.26L24.14 57.26Q24.75 57.26 25.54 58.33L25.54 58.33Q27.10 59.73 28.64 59.11Q30.18 58.50 31.92 55.81L31.92 55.81Q32.26 54.97 32.98 53.40Q33.71 51.83 34.52 50.04Q35.34 48.25 36.01 46.71Q36.68 45.17 36.90 44.50L36.90 44.50L36.96 44.27Q36.96 44.10 37.18 43.88L37.18 43.88Q37.24 43.66 37.46 42.98Q37.69 42.31 37.91 41.42L37.91 41.42Q38.14 40.80 38.56 39.57Q38.98 38.34 39.45 36.99Q39.93 35.65 40.26 34.75L40.26 34.75Q40.54 33.58 40.96 32.20Q41.38 30.83 41.66 30.10L41.66 30.10Q41.89 29.66 42.34 28.28Q42.78 26.91 43.34 25.29L43.34 25.29Q44.02 23.10 44.63 21.23Q45.25 19.35 45.61 18.15Q45.98 16.94 45.86 16.78L45.86 16.78L44.91 16.94Q43.90 17.11 42.73 17.34L42.73 17.34Q41.78 17.73 40.88 17.56L40.88 17.56Q39.98 17.45 39.98 17.28L39.98 17.28Q39.98 17.22 39.98 17.22L39.98 17.22L39.98 16.94Q39.82 17.06 39.54 16.86Q39.26 16.66 39.03 16.30Q38.81 15.94 38.81 15.66L38.81 15.66Q38.81 15.21 39.93 14.84Q41.05 14.48 42.78 14.26L42.78 14.26Q43.90 14.09 45.00 13.95Q46.09 13.81 46.82 13.70L46.82 13.70Q47.04 13.53 47.63 13.70Q48.22 13.86 48.86 14.14Q49.50 14.42 49.78 14.76L49.78 14.76Q50.12 15.21 50.20 15.71Q50.29 16.22 50.06 17.11Q49.84 18.01 49.25 19.66Q48.66 21.31 47.60 24.17L47.60 24.17Q46.37 27.64 45.42 30.47Q44.46 33.30 43.68 35.14L43.68 35.14Q43.51 35.76 43.09 36.94Q42.67 38.11 42.28 39.32Q41.89 40.52 41.66 41.30L41.66 41.30Q41.22 42.37 40.82 43.60Q40.43 44.83 40.21 45.56L40.21 45.56Q40.21 46.01 39.98 46.57Q39.76 47.13 39.48 47.41L39.48 47.41L39.09 48.36Q38.70 49.37 38.14 50.71L38.14 50.71Q37.69 51.83 37.16 53.20Q36.62 54.58 36.18 55.30L36.18 55.30Q35.90 55.98 35.50 56.56Q35.11 57.15 35.11 57.38L35.11 57.38L35.11 57.54Q35.06 57.71 34.83 57.71L34.83 57.71L34.66 57.82Q34.50 57.99 34.50 58.27L34.50 58.27Q34.38 58.61 33.91 59.17Q33.43 59.73 32.79 60.34Q32.14 60.96 31.50 61.44Q30.86 61.91 30.41 62.14ZM56.78 54.80L56.78 54.80Q55.78 54.52 55.16 54.30L55.16 54.30L54.54 54.13Q54.66 53.85 54.46 53.62Q54.26 53.40 53.65 53.34L53.65 53.34Q52.81 52.84 52.11 52.08Q51.41 51.33 50.96 50.60Q50.51 49.87 50.29 49.37L50.29 49.37Q49.90 48.53 49.92 48.33Q49.95 48.14 50.57 47.86L50.57 47.86Q51.18 47.41 51.49 47.58Q51.80 47.74 52.25 48.70L52.25 48.70Q52.98 49.98 54.74 50.66Q56.50 51.33 58.72 51.24Q60.93 51.16 62.94 50.26L62.94 50.26Q65.02 49.42 65.55 48.50Q66.08 47.58 65.13 46.12L65.13 46.12Q64.96 45.67 64.74 45.39Q64.51 45.11 64.04 44.66Q63.56 44.22 62.50 43.21L62.50 43.21Q61.66 42.82 60.96 42.48Q60.26 42.14 59.47 41.75L59.47 41.75Q58.58 41.30 57.32 40.44Q56.06 39.57 54.94 38.50Q53.82 37.44 53.31 36.54L53.31 36.54Q52.42 35.70 51.97 34.22Q51.52 32.74 51.63 31.06Q51.74 29.38 52.47 28.03L52.47 28.03Q52.81 27.25 53.62 26.10Q54.43 24.95 55.44 23.78Q56.45 22.60 57.40 21.65Q58.35 20.70 58.97 20.30L58.97 20.30Q59.42 19.86 59.92 19.35L59.92 19.35L60.42 18.90Q60.48 18.62 60.65 18.62L60.65 18.62L60.76 18.62Q61.04 18.46 61.99 18.06Q62.94 17.67 64.06 16.61L64.06 16.61Q67.82 14.82 70.17 13.98Q72.52 13.14 74.03 13.14L74.03 13.14Q75.43 13.19 76.58 13.78Q77.73 14.37 78.48 15.32Q79.24 16.27 79.41 17.62L79.41 17.62Q79.80 18.96 79.18 20.72Q78.57 22.49 77.36 24.03Q76.16 25.57 74.76 26.35L74.76 26.35Q73.19 27.02 72.66 26.94Q72.13 26.86 72.18 25.79L72.18 25.79Q72.18 25.34 72.49 24.73Q72.80 24.11 74.20 22.54L74.20 22.54Q75.99 19.91 76.38 18.34L76.38 18.34Q76.66 17.34 76.27 16.89L76.27 16.89Q76.05 16.66 75.66 16.61L75.66 16.61Q75.32 16.50 74.45 16.61Q73.58 16.72 72.55 16.92Q71.51 17.11 70.78 17.31Q70.06 17.50 70.06 17.62L70.06 17.62L70.06 17.78Q70.06 17.84 70 17.90L70 17.90Q70 17.95 69.83 17.90L69.83 17.90Q69.72 17.90 68.88 18.34Q68.04 18.79 66.86 19.52L66.86 19.52L64.51 20.98Q63.34 21.70 62.52 22.24Q61.71 22.77 61.66 22.88L61.66 22.88Q61.54 23.50 60.37 24L60.37 24Q59.25 24.67 58.32 25.96Q57.40 27.25 56.28 29.15L56.28 29.15Q55.33 30.44 54.94 31.92Q54.54 33.41 54.94 34.30L54.94 34.30Q55.22 35.20 56.67 36.60Q58.13 38 60.31 39.29L60.31 39.29Q62.22 40.35 63.73 41.39Q65.24 42.42 66.22 43.38Q67.20 44.33 67.54 45.06L67.54 45.06Q68.21 46.01 68.52 46.99Q68.82 47.97 68.85 48.86Q68.88 49.76 68.66 50.49L68.66 50.49Q68.26 51.38 67.28 52.34Q66.30 53.29 65.63 53.23L65.63 53.23Q65.02 53.40 64.71 53.62Q64.40 53.85 64.01 54.02L64.01 54.02Q63.62 54.24 62.36 54.46Q61.10 54.69 59.58 54.77Q58.07 54.86 56.78 54.80Z'

  return (
    <div ref={containerRef} className="signature" aria-label="PJS">
      <svg
        className="signature-svg"
        viewBox="2 11 80 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d={d}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ strokeDasharray: '2000', strokeDashoffset: '2000' }}
        />
        <circle
          ref={penRef}
          r="3"
          fill="currentColor"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  )
}

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
            <p className="hero-attr">built by Candlefish</p>
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

        {/* ──── Demo callout ──── */}
        <section className="demo-callout">
          <div className="demo-glow" aria-hidden="true" />
          <p className="demo-confidential">Confidential — Do Not Share</p>
          <span className="demo-pulse" aria-hidden="true" />
          <p className="demo-label">Live demo</p>
          <h2 className="demo-heading">See Perch in action.</h2>
          <p className="demo-desc">
            The first instrument, running against real Tharp production data.
          </p>
          <a href="https://tharp-demo.highline.work/perch/" target="_blank" rel="noreferrer" className="demo-cta">
            Open live demo
            <ArrowUpRight className="icon" aria-hidden="true" />
          </a>
        </section>

        {/* ──── Intro ──── */}
        <section className="intro">
          <div className="intro-lead">
            <p className="section-label">Why instruments</p>
            <h2 className="display-heading">
              The industry calls everything an agent.<br />
              We build instruments.
            </h2>
          </div>

          <div className="intro-body">
            <p>
              An instrument is purpose-built operational intelligence — software
              that reads a domain, interprets what happened, and delivers the
              operator read before anyone has to ask. Not a dashboard to stare at.
              Not a chatbot to prompt. A named, specific piece of the system that
              does one thing exceptionally well.
            </p>
            <p>
              Wake is the platform underneath — the shared memory, the connectors,
              the synthesis layer. It does the hard work quietly so each instrument
              can stay calm and specific to the operator receiving it.
            </p>
          </div>

          <div className="intro-story">
            <h3>How this started</h3>
            <p>
              We were deep in the Tharp engagement — building the pitch deck,
              mapping the operation — and hit a gap. Nobody had done a proper read
              on the financials. Not a dashboard. Not a spreadsheet export. An
              actual interpreted briefing that tells the owner what moved and why
              it matters.
            </p>
            <p>
              So we built one. And then it became obvious: this wasn't just useful
              for Tharp. Every operator we work with has the same gap. The financial
              read was the first instrument, but the architecture works anywhere.
            </p>
          </div>

          <div className="intro-story">
            <h3>Where this goes</h3>
            <p>
              Perch is the first. There will be more — different domains, different
              operators, each one named and specific. The point is we build these
              together. Every instrument we ship makes the platform smarter.
              Collectively, we are building the Candlefish operating intelligence
              system — and that is worth building toward.
            </p>
          </div>

          <Signature />
        </section>

        {/* ──── Perch specifically ──── */}
        <section className="instrument">
          <div className="instrument-header">
            <p className="section-label">First instrument</p>
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

          <div className="voice-specimens">
            <div className="voice-specimen">
              <figure className="specimen-figure">
                <img
                  src="/brand/voice-card-briefing.svg"
                  alt="Perch weekly owner briefing specimen"
                  width={720}
                  height={420}
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

            <div className="voice-specimen">
              <figure className="specimen-figure">
                <img
                  src="/brand/voice-card-anomaly.svg"
                  alt="Perch anomaly alert specimen"
                  width={720}
                  height={420}
                  loading="lazy"
                />
              </figure>
              <div className="specimen-meta">
                <h3>Anomaly alert</h3>
                <p>
                  A duplicate charge, a category mismatch, an unusual vendor pattern.
                  Surfaced before close — not after.
                </p>
              </div>
            </div>

            <div className="voice-specimen">
              <figure className="specimen-figure">
                <img
                  src="/brand/voice-card-cashflow.svg"
                  alt="Perch cash flow read specimen"
                  width={720}
                  height={420}
                  loading="lazy"
                />
              </figure>
              <div className="specimen-meta">
                <h3>Cash flow read</h3>
                <p>
                  Runway, receivables, and pressure points — in operator language,
                  with the warning visible before the problem becomes urgent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ──── Engineering guide ──── */}
        <section className="tech-ref">
          <div className="tech-ref-header">
            <p className="section-label">Engineering</p>
            <h2 className="section-heading">How Perch works.</h2>
            <p className="tech-header-note">
              Case study: Perch as implemented for the Tharp engagement.
              This section documents the specific architecture, data pipeline,
              and integration surface behind the first instrument.
            </p>
            <p className="confidential-badge">Confidential — internal engineering reference only</p>
          </div>

          <div className="tech-grid">
            {/* ── Architecture ── */}
            <div className="tech-block tech-block--full">
              <h3>Architecture</h3>
              <pre className="tech-diagram">{`Syteline Cloud ERP        OneView Data Fabric        P&L (CSV/Excel)
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 │
                    Tharp Ingestion Pipeline
                    (IONAPI auth, REST + SMB connectors)
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    MongoDB (:27117)      │
                    │    snapshots             │
                    │    erp_data              │
                    │    financials            │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     Scheduling Engine    Financial Analysis   Anomaly Detection
     (production ops)     (P&L, cash flow)     (duplicates, drift)
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                    Synthesizer (Claude Opus 4.5)
                    Operator briefing generation
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              Weekly brief  Anomaly alert  Cash read`}</pre>
            </div>

            {/* ── Stack ── */}
            <div className="tech-block">
              <h3>Stack</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>Runtime</td><td>Python 3.11+, stdlib HTTP server</td></tr>
                  <tr><td>Database</td><td>MongoDB (Docker, port 27117)</td></tr>
                  <tr><td>Frontend</td><td>React 19 + TypeScript + Vite</td></tr>
                  <tr><td>Auth</td><td>JWT (HS256), IONAPI hybrid auth</td></tr>
                  <tr><td>ERP</td><td>Syteline Cloud (REST + custom IDOs)</td></tr>
                  <tr><td>Data fabric</td><td>OneView JSON ingestion</td></tr>
                  <tr><td>File access</td><td>SMB mount (shared drives)</td></tr>
                  <tr><td>Synthesis</td><td>Claude Opus 4.5</td></tr>
                  <tr><td>Secrets</td><td>Infisical (all credentials)</td></tr>
                  <tr><td>Deploy</td><td>Mac Studio via rsync + LaunchAgent</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Data pipeline ── */}
            <div className="tech-block">
              <h3>Data pipeline</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>Ingest</td><td>Syteline ERP via IONAPI REST. Read-only posture — never writes back to ERP. Snapshots stored in MongoDB.</td></tr>
                  <tr><td>Financials</td><td>P&L ingestion from CSV/Excel and optional API. Parsed into structured financial records.</td></tr>
                  <tr><td>Data fabric</td><td>OneView JSON payloads ingested via dedicated pipeline. SMB file server for shared drive access.</td></tr>
                  <tr><td>Synthesize</td><td>Opus generates operator briefings from raw financial and operational data. Linked to context memory.</td></tr>
                  <tr><td>Output</td><td>Weekly briefing, anomaly alerts, cash flow reads. Served via Tharp API on port 5200.</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Tharp API surface ── */}
            <div className="tech-block tech-block--full">
              <h3>Tharp API</h3>
              <p className="tech-note">Python stdlib HTTP server with JWT auth. Serves the React SPA and exposes the data layer. Port 5200.</p>
              <pre className="tech-code">{`# API (JWT-authenticated, Tailscale-only)
GET  /api/snapshots                # ERP data snapshots
GET  /api/financials               # P&L and financial records
GET  /api/scheduling               # Production scheduling data
POST /api/ingest                   # Trigger ingestion pipeline

# Perch briefing endpoints
GET  /perch/briefing               # Latest operator briefing
GET  /perch/anomalies              # Flagged anomalies
GET  /perch/cashflow               # Cash flow read

# Frontend (SPA)
GET  /perch/*                      # React app (static fallback)`}</pre>
            </div>

            {/* ── Source locations ── */}
            <div className="tech-block">
              <h3>Source locations</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>API server</td><td><code>tharp/src/tharp/server/app.py</code></td></tr>
                  <tr><td>ERP connector</td><td><code>tharp/src/tharp/automator/api/</code></td></tr>
                  <tr><td>Ingestion</td><td><code>tharp/src/tharp/ingest_*.py</code></td></tr>
                  <tr><td>Financial P&L</td><td><code>tharp/src/tharp/ingest_financials.py</code></td></tr>
                  <tr><td>Dashboard</td><td><code>tharp/src/dashboard/</code></td></tr>
                  <tr><td>Brand site</td><td><code>instrument-repo/workers/</code></td></tr>
                </tbody>
              </table>
            </div>

            {/* ── MongoDB collections ── */}
            <div className="tech-block">
              <h3>MongoDB collections</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td><code>snapshots</code></td><td>ERP data snapshots (timestamped)</td></tr>
                  <tr><td><code>erp_data</code></td><td>Parsed Syteline records</td></tr>
                  <tr><td><code>financials</code></td><td>P&L, cash flow, revenue data</td></tr>
                  <tr><td><code>scheduling</code></td><td>Production scheduling exports</td></tr>
                  <tr><td><code>anomalies</code></td><td>Flagged items for operator review</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Briefing delivery ── */}
            <div className="tech-block tech-block--full">
              <h3>Briefing delivery</h3>
              <p className="tech-note">
                All Perch data and briefings are served on the Candlefish Tailscale network only.
                Nothing is exposed to the public internet. Access requires Tailscale mesh membership.
              </p>
              <pre className="tech-code">{`# Tharp API (port 5200, Tailscale-only)
tharp-demo.highline.work/perch/     # Live Perch dashboard
tharp-scheduling.highline.work/     # Scheduling interface

# Cloudflared tunnel for remote access
# Mac Studio deployment via rsync + SSH`}</pre>
            </div>

            {/* ── Security ── */}
            <div className="tech-block tech-block--full">
              <h3>Security posture</h3>
              <p className="tech-note">
                Perch operates entirely within Candlefish's secured infrastructure. No financial data
                is accessible from the public internet.
              </p>
              <table className="tech-table">
                <tbody>
                  <tr><td>Network</td><td><strong>Tailscale</strong> zero-trust mesh. All services (API, MongoDB, dashboards) are Tailscale-only. No public endpoints for financial data.</td></tr>
                  <tr><td>Secrets</td><td><strong>Infisical</strong> vault. All API keys, IONAPI credentials, and database URIs managed centrally. No .env files.</td></tr>
                  <tr><td>ERP access</td><td><strong>Read-only</strong> posture. Perch never writes back to Syteline. All data flows are inbound snapshots only.</td></tr>
                  <tr><td>Auth</td><td>JWT (HS256) on the API. IONAPI hybrid auth (password grant + raw REST) for ERP. Cloudflared tunnel for remote.</td></tr>
                  <tr><td>Pre-commit</td><td><strong>Gitleaks v8</strong> scans every commit. Custom rules for API keys, MongoDB URIs, IONAPI tokens.</td></tr>
                  <tr><td>Monitoring</td><td>Daily security monitor: firewall, SSH config, .env permissions, open ports, subdomain takeover.</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Instrument pattern ── */}
            <div className="tech-block tech-block--full">
              <h3>The instrument pattern</h3>
              <p className="tech-note">
                Every instrument follows the same architecture. Perch is the reference implementation.
              </p>
              <table className="tech-table">
                <tbody>
                  <tr><td>Ingest</td><td>Domain-specific connector pulls data on a schedule. Read-only posture. Snapshots stored in MongoDB.</td></tr>
                  <tr><td>Analyze</td><td>Service layer computes domain metrics — financial analysis, anomaly detection, scheduling intelligence.</td></tr>
                  <tr><td>Synthesize</td><td>Claude Opus generates natural language interpretation. Linked to operator context.</td></tr>
                  <tr><td>Expose</td><td>REST API + React dashboard. The operator never sees the pipeline — only the read.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ──── Footer ──── */}
        <footer className="site-footer">
          <p className="footer-closing">Perch is the first member of the <span className="accent">candlefish.ai</span> instrument&nbsp;family.</p>
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

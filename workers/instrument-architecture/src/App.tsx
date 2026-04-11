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

  // PJS path — connected cursive strokes
  const d = [
    // P downstroke + loop
    'M 8 52 L 8 10 C 8 10 10 6 16 6 C 26 6 32 12 32 18 C 32 26 26 30 18 30 L 8 30',
    // connecting stroke to J
    'M 8 52 C 14 50 22 46 30 40',
    // J stem + hook
    'M 42 8 L 42 44 C 42 52 38 56 32 56 C 28 56 26 52 28 48',
    // connecting stroke to S
    'M 42 36 C 48 32 54 28 60 24',
    // S curve
    'M 72 16 C 68 12 60 10 58 14 C 54 18 58 24 64 28 C 70 32 76 34 76 42 C 76 48 72 52 64 52 C 60 52 56 48 58 44',
  ].join(' ')

  return (
    <div ref={containerRef} className="signature" aria-label="PJS">
      <svg
        className="signature-svg"
        viewBox="0 0 86 62"
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

            <div className="voice-specimen">
              <figure className="specimen-figure">
                <img
                  src="/brand/voice-card-anomaly.svg"
                  alt="Perch anomaly alert specimen"
                  width={720}
                  height={460}
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
                  height={460}
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

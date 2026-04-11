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
          <a href="https://tharp-demo.highline.work/perch/" target="_blank" rel="noreferrer" className="demo-link">
            <span className="demo-pulse" aria-hidden="true" />
            <span className="demo-text">
              <strong>See Perch live.</strong> The first instrument, running against real Tharp data.
            </span>
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
              <pre className="tech-diagram">{`Simplifi (Quicken)          QuickBooks          Bank feeds
        │                        │                    │
        └────────────────────────┼────────────────────┘
                                 │
                    SimplifiLiveConnector
                    (Playwright browser automation, 15-min sync)
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    PostgreSQL            │
                    │    wealth_accounts       │
                    │    wealth_transactions   │
                    │    wealth_audit_log      │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
     NetWorthService    ForensicAudit     ML Classification
     (balances, rates)  (immutable log)   (category, entity)
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                         WakeBrain + Synthesizer
                         (Opus 4.5 — synthesis, briefings)
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
                  <tr><td>Runtime</td><td>Python 3.12, FastAPI, Uvicorn</td></tr>
                  <tr><td>Database</td><td>PostgreSQL (asyncpg)</td></tr>
                  <tr><td>Vectors</td><td>Qdrant (voyage-3, 1024-dim)</td></tr>
                  <tr><td>Graph</td><td>Neo4j (entities, relationships)</td></tr>
                  <tr><td>Cache</td><td>Redis</td></tr>
                  <tr><td>Browser</td><td>Playwright (connector sync)</td></tr>
                  <tr><td>Synthesis</td><td>Claude Opus 4.5</td></tr>
                  <tr><td>Classification</td><td>Claude Haiku 3.5</td></tr>
                  <tr><td>Secrets</td><td>Infisical (all env vars)</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Data pipeline ── */}
            <div className="tech-block">
              <h3>Data pipeline</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>Sync</td><td>Every 15 min via Playwright into Simplifi. Delta detection — only new transactions.</td></tr>
                  <tr><td>Classify</td><td>ML assigns category, entity (personal / business / household), tax deductibility. Uncertain items go to review queue.</td></tr>
                  <tr><td>Analyze</td><td>Net worth, savings rate, cash flow, anomaly detection. All changes immutably logged.</td></tr>
                  <tr><td>Synthesize</td><td>Opus generates the operator read from raw analysis. Linked to Wake memory via vector search.</td></tr>
                  <tr><td>Output</td><td>Weekly briefing, anomaly alerts, cash flow reads. Exposed via Wealth V2 API and MCP tools.</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Perch API surface ── */}
            <div className="tech-block tech-block--full">
              <h3>Perch API surface</h3>
              <p className="tech-note">Endpoints Perch uses from the Wake platform. This is the operator-facing data layer, not the personal finance engine.</p>
              <pre className="tech-code">{`GET  /wealth/v2/accounts                         # Business accounts + balances
GET  /wealth/v2/transactions                      # Transaction listing + filters
GET  /wealth/v2/reports/cash-flow                 # Monthly cash flow trends
GET  /wealth/v2/reports/entity/{entity}           # Full entity report (business only)
GET  /wealth/v2/reports/income-statement          # Revenue vs expenses
POST /wealth/v2/insights                          # Ingest financial insight → Wake memory
GET  /wealth/v2/insights/search                   # Semantic search over insights
GET  /wealth/v2/review-queue                      # ML items needing operator approval
POST /wealth/v2/review-queue/{id}/approve         # Confirm classification
POST /wealth/v2/review-queue/{id}/correct         # Override classification`}</pre>
            </div>

            {/* ── Services ── */}
            <div className="tech-block">
              <h3>Core services</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>ForensicAuditService</td><td>Immutable audit trail. Logs every transaction change, category assignment, and ML classification. Generates cash flow statements and income reports.</td></tr>
                  <tr><td>ConnectorManager</td><td>Orchestrates data connectors. Handles sync scheduling, backfill, health checks. Each connector implements connect, sync, disconnect.</td></tr>
                  <tr><td>WakeBrain</td><td>Orchestrates memory analysis. Extracts commitments, relationships, risks from ingested data. Generates proactive insights and operator briefings.</td></tr>
                  <tr><td>Synthesizer</td><td>LLM abstraction layer. Routes to Opus (complex synthesis) or Haiku (quick classification). Tracks token usage and cost.</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Key tables ── */}
            <div className="tech-block">
              <h3>Perch data</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td><code>wealth_accounts</code></td><td>Business accounts (institution, type, balance)</td></tr>
                  <tr><td><code>wealth_transactions</code></td><td>Transactions (payee, amount, category, entity)</td></tr>
                  <tr><td><code>wealth_audit_log</code></td><td>Immutable audit trail (before/after state)</td></tr>
                  <tr><td><code>wealth_category_assignments</code></td><td>ML classification results</td></tr>
                  <tr><td><code>wealth_review_queue</code></td><td>Items pending operator review</td></tr>
                </tbody>
              </table>
            </div>

            {/* ── File locations ── */}
            <div className="tech-block tech-block--full">
              <h3>Perch source locations</h3>
              <table className="tech-table">
                <tbody>
                  <tr><td>Perch API routes</td><td><code>wake/src/wake/api/routers/wealth_v2_pkg/</code></td></tr>
                  <tr><td>Audit service</td><td><code>wake/src/wake/services/forensic_audit_service.py</code></td></tr>
                  <tr><td>Data connector</td><td><code>wake/src/wake/integrations/simplifi_live.py</code></td></tr>
                  <tr><td>Connector orchestration</td><td><code>wake/src/wake/integrations/manager.py</code></td></tr>
                  <tr><td>Intelligence (brain)</td><td><code>wake/src/wake/agent/brain.py</code></td></tr>
                  <tr><td>Synthesis (LLM)</td><td><code>wake/src/wake/agent/synthesizer.py</code></td></tr>
                  <tr><td>MCP exposure</td><td><code>wake/src/wake/mcp/wake_server.py</code></td></tr>
                  <tr><td>Brand site</td><td><code>instrument-repo/workers/instrument-architecture/</code></td></tr>
                </tbody>
              </table>
            </div>

            {/* ── Briefing delivery ── */}
            <div className="tech-block tech-block--full">
              <h3>Briefing delivery</h3>
              <p className="tech-note">
                Perch briefings are delivered via internal MCP tools on the Candlefish Tailscale network only.
                Nothing is exposed to the public internet. All access requires Tailscale mesh membership.
              </p>
              <pre className="tech-code">{`morning_brief(refresh)       # Daily operator briefing — signals, actions, attention items
weekly_digest(weeks_back)    # Weekly summary with patterns and recommendations
recall(query)                # Semantic search across financial insights + context
search(query)                # Full-text search across business data`}</pre>
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
                  <tr><td>Network</td><td><strong>Tailscale</strong> zero-trust mesh. All internal services (API, MCP, databases) are Tailscale-only. No public endpoints for financial data.</td></tr>
                  <tr><td>Secrets</td><td><strong>Infisical</strong> vault. All API keys, database credentials, and connector auth are managed centrally. No .env files. Auto-loaded on shell startup.</td></tr>
                  <tr><td>Pre-commit</td><td><strong>Gitleaks v8</strong> scans every commit for leaked secrets. Custom rules detect Anthropic keys, AWS credentials, MongoDB URIs, Plaid secrets. Blocks commit on detection.</td></tr>
                  <tr><td>Audit</td><td><strong>Immutable audit log</strong> for all financial data changes. Every transaction create, update, delete, category change, and ML classification is logged with before/after state.</td></tr>
                  <tr><td>Monitoring</td><td>Daily security monitor checks firewall status, SSH config, .env permissions, open ports, and subdomain takeover risk.</td></tr>
                  <tr><td>Auth</td><td>Service-level bearer tokens on Tailscale. GitHub token-based. AWS IAM. Cloudflare API tokens per zone. No shared credentials.</td></tr>
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
                  <tr><td>Ingest</td><td>Domain-specific connector pulls data on a schedule. Delta sync. Immutable audit log.</td></tr>
                  <tr><td>Classify</td><td>ML categorizes incoming data. Uncertain items go to a review queue for human confirmation.</td></tr>
                  <tr><td>Analyze</td><td>Service layer computes domain metrics. Results stored in PostgreSQL.</td></tr>
                  <tr><td>Synthesize</td><td>WakeBrain + Opus generates natural language interpretation. Linked to Wake memory.</td></tr>
                  <tr><td>Expose</td><td>REST API + MCP tools. The operator never sees the pipeline — only the read.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ──── Footer ──── */}
        <footer className="site-footer">
          <p className="footer-closing">Perch is the first member of the instrument&nbsp;family.</p>
          <img
            src="/brand/pjs-signature.svg"
            alt="PJS"
            width={200}
            height={80}
            className="footer-signature"
          />
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

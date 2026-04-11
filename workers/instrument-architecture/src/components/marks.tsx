import { clsx } from 'clsx'

type PerchMarkProps = {
  className?: string
  mirrored?: boolean
  scoped?: boolean
}

export function PerchMark({ className, mirrored = false, scoped = false }: PerchMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={clsx('overflow-visible', className)}
      viewBox="-120 -110 240 220"
      fill="none"
    >
      {scoped ? (
        <>
          <circle cx="0" cy="0" r="88" stroke="currentColor" strokeOpacity="0.9" strokeWidth="4" />
          <path d="M-106 0H106" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.6" />
          <path d="M0 -106V106" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.6" />
        </>
      ) : null}

      <g transform={mirrored ? 'scale(-1 1)' : undefined}>
        <path
          d="M -46,0 C -50,-4 -58,-12 -64,-18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M -46,0 C -50,4 -58,12 -64,18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M -64,-18 C -67,-10 -67,10 -64,18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M -46,0 C -36,-20 -10,-28 14,-26 C 32,-24 46,-16 52,-6 C 55,-1 55,3 52,8 C 44,20 22,26 2,24 C -20,22 -38,14 -46,0 Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <line x1="-6" y1="-27" x2="-8" y2="-42" stroke="currentColor" strokeLinecap="round" strokeWidth="2.7" />
        <line x1="2" y1="-28" x2="2" y2="-46" stroke="currentColor" strokeLinecap="round" strokeWidth="2.7" />
        <line x1="10" y1="-27" x2="11" y2="-42" stroke="currentColor" strokeLinecap="round" strokeWidth="2.7" />
        <line x1="18" y1="-25" x2="20" y2="-38" stroke="currentColor" strokeLinecap="round" strokeWidth="2.7" />
        <path
          d="M -8,-42 L -2,-44 L 2,-46 L 7,-44 L 11,-42 L 16,-40 L 20,-38"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.65"
        />
        <path
          d="M 28,-16 C 24,-4 24,4 28,12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.95"
        />
        <path
          d="M 30,6 C 24,14 16,16 12,12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
        <path
          d="M 52,1 C 48,-5 44,-6 40,-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.25"
        />
        <circle cx="38" cy="-7" r="3.2" fill="#4A9BA8" />
      </g>
    </svg>
  )
}

export function WordmarkLockup({ dark = false }: { dark?: boolean }) {
  return (
    <div className="inline-flex items-center gap-4">
      <PerchMark className={clsx('w-16', dark ? 'text-white' : 'text-stone-950')} />
      <div className={clsx('text-4xl font-bold tracking-[-0.06em]', dark ? 'text-white' : 'text-stone-950')}>
        Perch
        <span className="text-[var(--accent)]">.</span>
      </div>
    </div>
  )
}

const DEFAULT_LABELS = ['Service', 'Details', 'Review']

export default function ProgressBar({ current, labels = DEFAULT_LABELS }: { current: number; labels?: string[] }) {
  return <><div className="progress">{labels.map((_, i) => { const step = i + 1; const state = step < current ? 'done' : step === current ? 'active' : 'upcoming'; return <div style={{ display: 'contents' }} key={step}><div className={`progress-dot ${state}`}>{step < current ? '✓' : step}</div>{step < labels.length && <div className={`progress-line ${step < current ? 'done' : ''}`} />}</div> })}</div><div className="progress-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div></>
}

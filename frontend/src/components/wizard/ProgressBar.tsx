const LABELS = ['Account', 'Service', 'Details', 'Payment']

export default function ProgressBar({ current }: { current: number }) {
  return (
    <>
      <div className="progress">
        {LABELS.map((_, i) => {
          const step = i + 1
          const state = step < current ? 'done' : step === current ? 'active' : 'upcoming'
          return (
            <div style={{ display: 'contents' }} key={step}>
              <div className={`progress-dot ${state}`}>{step < current ? '✓' : step}</div>
              {step < LABELS.length && (
                <div className={`progress-line ${step < current ? 'done' : ''}`} />
              )}
            </div>
          )
        })}
      </div>
      <div className="progress-labels">
        {LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </>
  )
}

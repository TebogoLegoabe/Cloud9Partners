import type { ServiceType } from '../../types'
import { ADVISORY_FEES, formatRands, type DetailsData } from './types'

interface Props {
  serviceType: ServiceType
  details: DetailsData
  submitting: boolean
  error: string | null
  onBack: () => void
  onSubmit: () => void
}

export default function StepReview({
  serviceType,
  details,
  submitting,
  error,
  onBack,
  onSubmit,
}: Props) {
  const serviceName = serviceType === 'consulting' ? 'Expert consulting' : 'Quote comparison'
  const fee = ADVISORY_FEES[serviceType]
  const vehicle = [details.make, details.model, details.year, details.variant]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(' ')

  const rows: Array<[string, string]> = [
    ['Service', serviceName],
    ...(vehicle ? ([['Vehicle', vehicle]] as Array<[string, string]>) : []),
    ['Budget', formatRands(details.budget)],
    ['Condition', details.condition || 'Not specified'],
    ['Province', details.province || 'Not specified'],
    ['Timeline', details.timeline || 'Not specified'],
  ]

  return (
    <div>
      <h2 className="step-title">Review and pay</h2>
      <p className="step-sub">Confirm your details and pay your advisory fee to get started.</p>

      <div className="summary">
        {rows.map(([key, value]) => (
          <div className="summary-row" key={key}>
            <span className="summary-key">{key}</span>
            <span className="summary-value">{value}</span>
          </div>
        ))}
        <div className="summary-row">
          <span className="summary-key">Advisory fee</span>
          <span className="summary-fee">{formatRands(fee)} advisory fee</span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6, marginBottom: 14 }}>
        Pay securely below. Once confirmed, your request goes live and we get to work within
        24 hours.
      </p>

      <div className="pay-methods">
        <p className="pay-methods-title">Pay securely via</p>
        <div className="pay-badges">
          <div className="pay-badge">PayFast</div>
          <div className="pay-badge">Yoco</div>
          <span className="pay-note">Card · EFT · SnapScan</span>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="wizard-buttons">
        <button className="btn-back" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
        <button className="btn-next" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Setting up your account…' : 'Pay and get started →'}
        </button>
      </div>
    </div>
  )
}

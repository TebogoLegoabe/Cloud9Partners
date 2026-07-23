import type { ServiceType } from '../../types'
import { ADVISORY_FEES, formatRands, type DetailsData } from './types'

interface Props {
  serviceType: ServiceType
  details: DetailsData
  submitting: boolean
  error: string | null
  onBack: () => void
  onPayNow: () => void
  onPayLater: () => void
}

export default function StepReview({ serviceType, details, submitting, error, onBack, onPayNow, onPayLater }: Props) {
  const serviceName = serviceType === 'consulting' ? 'Expert consulting' : 'Quote comparison'
  const fee = ADVISORY_FEES[serviceType]
  const vehicle = [details.make, details.model, details.year, details.variant].map((v) => v.trim()).filter(Boolean).join(' ')
  const rows: Array<[string, string]> = [
    ['Service', serviceName],
    ...(vehicle ? ([['Vehicle', vehicle]] as Array<[string, string]>) : []),
    ['Budget', formatRands(details.budget)],
    ['Condition', details.condition || 'Not specified'],
    ['Province', details.province || 'Not specified'],
    ['Timeline', details.timeline || 'Not specified'],
  ]

  return <div>
    <h2 className="step-title">Review your request</h2>
    <p className="step-sub">Confirm your details, then pay now or securely submit your request and pay later.</p>
    <div className="summary">
      {rows.map(([key, value]) => <div className="summary-row" key={key}><span className="summary-key">{key}</span><span className="summary-value">{value}</span></div>)}
      <div className="summary-row"><span className="summary-key">Advisory fee</span><span className="summary-fee">{formatRands(fee)} advisory fee</span></div>
    </div>
    <p className="payment-explainer">Pay securely now to activate your request immediately, or send it today and complete payment later from your dashboard.</p>
    <div className="pay-methods"><p className="pay-methods-title">Secure payment options</p><div className="pay-badges"><div className="pay-badge">PayFast</div><div className="pay-badge">Yoco</div><span className="pay-note">Card · EFT · SnapScan</span></div></div>
    {error && <div className="form-error">{error}</div>}
    <div className="payment-actions">
      <button className="btn-next" onClick={onPayNow} disabled={submitting}>{submitting ? 'Saving your request…' : 'Pay now and get started →'}</button>
      <button className="btn-pay-later" onClick={onPayLater} disabled={submitting}>Send request — pay later</button>
      <button className="btn-back payment-back" onClick={onBack} disabled={submitting}>← Back</button>
    </div>
  </div>
}

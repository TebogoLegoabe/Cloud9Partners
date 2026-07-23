import { Link } from 'react-router-dom'

export default function StepSuccess({ payLater = false }: { payLater?: boolean }) {
  return <div style={{ textAlign: 'center', padding: '2rem 0' }}>
    <div className="success-icon">✓</div>
    <h2 className="step-title">{payLater ? 'Request sent!' : "You're in!"}</h2>
    <p className="success-copy">{payLater ? <>We’ve saved your request. It will remain marked <strong>Awaiting payment</strong> until you pay securely from your dashboard.</> : <>Your request is live. A Cloud9 Partners advisor will be in touch within <strong>24 hours</strong>.</>}</p>
    <div className="next-steps"><p className="next-steps-title">What happens next</p><p>{payLater ? <>1. Open your dashboard when you’re ready<br />2. Select “Pay now” on this request<br />3. Your request activates once payment is confirmed</> : <>1. We verify your payment<br />2. Your brief goes to our advisor or dealer network<br />3. Quotes or coaching arrive within 48 hours</>}</p></div>
    <p className="wizard-footnote"><Link to="/dashboard">Go to your dashboard →</Link></p>
  </div>
}

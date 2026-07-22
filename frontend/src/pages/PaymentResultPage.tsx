import { Link } from 'react-router-dom'
import StepSuccess from '../components/wizard/StepSuccess'
import '../styles/wizard.css'

export default function PaymentResultPage({ outcome }: { outcome: 'success' | 'cancelled' }) {
  return (
    <div className="wizard">
      <Link to="/" className="wizard-logo logo">
        <span className="l1">Cloud9</span> <span className="l2">Partners</span>
      </Link>

      {outcome === 'success' ? (
        <StepSuccess />
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <h2 className="step-title">Payment cancelled</h2>
          <p className="step-sub" style={{ maxWidth: 360, margin: '0 auto 24px' }}>
            No money left your account. Your request is saved — you can pay whenever you're
            ready from your dashboard.
          </p>
          <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
            Go to dashboard
          </Link>
        </div>
      )}
    </div>
  )
}

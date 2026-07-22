import { Link } from 'react-router-dom'

export default function StepSuccess() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div className="success-icon">✓</div>
      <h2 style={{ fontSize: 21, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 10 }}>
        You're in!
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--gray-500)',
          lineHeight: 1.7,
          maxWidth: 360,
          margin: '0 auto 24px',
        }}
      >
        Your request is live. A Cloud9 Partners advisor will be in touch within{' '}
        <strong style={{ color: 'var(--gray-900)' }}>24 hours</strong>. Check your email for
        confirmation.
      </p>
      <div className="next-steps">
        <p className="next-steps-title">What happens next</p>
        <p>
          1. We verify your payment (usually instant)
          <br />
          2. Your brief goes to our advisor or dealer network
          <br />
          3. Quotes or coaching arrive within 48 hours
        </p>
      </div>
      <p className="wizard-footnote">
        <Link to="/dashboard">Go to your dashboard →</Link>
      </p>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import '../styles/wizard.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (!isSupabaseConfigured || !supabase) {
      setError('Authentication has not been configured for this environment yet.')
      return
    }
    setSubmitting(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setSubmitting(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  return <div className="auth-shell"><div className="wizard auth-card"><Link to="/" className="wizard-logo logo"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link><div className="auth-heading"><span className="section-label">Account recovery</span><h1 className="step-title">Reset your password</h1><p className="step-sub">Enter your account email and we’ll send you a secure reset link.</p></div>{sent ? <div className="verify-email"><div className="verify-icon" aria-hidden="true">✓</div><h1>Check your email</h1><p>If an account exists for <strong>{email}</strong>, a password-reset link is on its way.</p><Link to="/signin" className="btn-primary verify-signin">Return to sign in →</Link><p className="verify-help">Check your spam folder if it does not arrive within a few minutes.</p></div> : <form onSubmit={(event) => void handleSubmit(event)}><div className="field"><label htmlFor="reset-email">Email address</label><input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="thabo@example.com" required /></div>{error && <div className="form-error">{error}</div>}<div className="wizard-buttons"><button className="btn-next" style={{ flex: 1 }} type="submit" disabled={submitting}>{submitting ? 'Sending reset link…' : 'Send reset link'}</button></div><p className="wizard-footnote"><Link to="/signin">← Back to sign in</Link></p></form>}</div></div>
}

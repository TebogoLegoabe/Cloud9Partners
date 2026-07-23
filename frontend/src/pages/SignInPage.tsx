import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import '../styles/wizard.css'

export default function SignInPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const accountCreated = params.get('account') === 'created'
  const emailVerified = params.get('verified') === '1'
  const sessionExpired = params.get('expired') === '1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null)
    if (!isSupabaseConfigured || !supabase) { setError('Authentication has not been configured for this environment yet.'); return }
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message.toLowerCase().includes('email not confirmed') ? 'Please verify your email using the link we sent before signing in.' : signInError.message)
      return
    }
    navigate('/dashboard')
  }

  return <div className="auth-shell"><div className="wizard auth-card"><Link to="/" className="wizard-logo logo"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link><div className="auth-heading"><span className="section-label">Welcome back</span><h2 className="step-title">Sign in to your account</h2><p className="step-sub">Track your requests and review dealer quotes securely.</p></div>{sessionExpired && <div className="form-notice session-notice"><strong>Session expired</strong><span>For your security, we signed you out. Sign in again to continue.</span></div>}{(accountCreated || emailVerified) && <div className="form-notice"><strong>{emailVerified ? 'Email verified' : 'Account created'}</strong><span>{emailVerified ? 'Your email has been confirmed. You can now sign in.' : 'Verify your email using the link we sent, then sign in below.'}</span></div>}<form onSubmit={(e) => void handleSubmit(e)}><div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="thabo@example.com" required /></div><div className="field"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required /></div>{error && <div className="form-error">{error}</div>}<div className="wizard-buttons"><button className="btn-next" style={{ flex: 1 }} type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in securely'}</button></div></form><p className="wizard-footnote">New to Cloud9? <Link to="/signup">Create an account</Link></p><p className="auth-legal">Protected by Supabase authentication. By continuing, you agree to our <Link to="/terms">terms</Link>.</p></div></div>
}

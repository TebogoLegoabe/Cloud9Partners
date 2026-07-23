import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import StepAccount from '../components/wizard/StepAccount'
import { initialWizardData, type AccountData } from '../components/wizard/types'
import { useAuth } from '../context/AuthContext'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import '../styles/wizard.css'

export default function RegistrationPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [account, setAccount] = useState<AccountData>(initialWizardData.account)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdEmail, setCreatedEmail] = useState<string | null>(null)
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'sent'>('idle')
  if (!loading && session) return <Navigate to="/dashboard" replace />

  const register = async () => {
    setError(null)
    if (!isSupabaseConfigured || !supabase) { setError('Authentication has not been configured for this environment yet.'); return }
    setSubmitting(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: { first_name: account.firstName, last_name: account.lastName, phone: account.phone },
          emailRedirectTo: `${window.location.origin}/signin?verified=1`,
        },
      })
      if (signUpError) throw new Error(signUpError.message)
      if (!data.session) { setCreatedEmail(account.email); setSubmitting(false); return }
      navigate('/request')
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not create your account. Please try again.'); setSubmitting(false) }
  }

  const resendVerification = async () => {
    if (!supabase || !createdEmail) return
    setResendState('sending'); setError(null)
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email: createdEmail, options: { emailRedirectTo: `${window.location.origin}/signin?verified=1` } })
    if (resendError) { setError(resendError.message); setResendState('idle'); return }
    setResendState('sent')
  }

  return <div className="auth-shell"><div className="wizard auth-card registration-card"><Link to="/" className="wizard-logo logo"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link>{createdEmail ? <div className="verify-email"><div className="verify-icon" aria-hidden="true">✓</div><span className="section-label">Account created</span><h1>Verify your email to continue</h1><p>We sent a verification link to <strong>{createdEmail}</strong>. Open the email and confirm your address before signing in.</p><div className="verification-steps"><div><b>1</b><span><strong>Check your inbox</strong><small>Look for an email from Cloud9 Partners.</small></span></div><div><b>2</b><span><strong>Verify your address</strong><small>Select the confirmation link in the email.</small></span></div><div><b>3</b><span><strong>Sign in</strong><small>Return and access your dashboard and services.</small></span></div></div>{error && <div className="form-error">{error}</div>}<Link to="/signin?account=created" className="btn-primary verify-signin">Continue to sign in →</Link><button className="resend-button" onClick={() => void resendVerification()} disabled={resendState === 'sending'}>{resendState === 'sending' ? 'Sending…' : resendState === 'sent' ? 'Verification email sent' : 'Didn’t receive it? Resend email'}</button><p className="verify-help">Check your spam or promotions folder if the email takes a few minutes to arrive.</p></div> : <><div className="auth-heading"><span className="section-label">Your Cloud9 account</span><p className="step-sub">Register once, then submit and track all your services from one dashboard.</p></div><StepAccount data={account} onChange={setAccount} onNext={() => void register()} submitting={submitting} submitError={error} /></>}</div></div>
}

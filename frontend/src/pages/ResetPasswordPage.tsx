import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import '../styles/wizard.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Use at least 8 characters for your new password.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }
    if (!supabase) return
    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setSubmitting(false)
      return
    }
    await supabase.auth.signOut({ scope: 'local' })
    navigate('/signin?password=updated', { replace: true })
  }

  return <div className="auth-shell"><div className="wizard auth-card"><Link to="/" className="wizard-logo logo"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link><div className="auth-heading"><span className="section-label">Secure password reset</span><h1 className="step-title">Choose a new password</h1><p className="step-sub">Your new password must contain at least 8 characters.</p></div>{!loading && !session ? <div><div className="form-error">This password-reset link is invalid or has expired. Request a new one to continue.</div><Link to="/forgot-password" className="btn-primary verify-signin">Request a new reset link</Link></div> : <form onSubmit={(event) => void handleSubmit(event)}><div className="field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /></div><div className="field"><label htmlFor="confirm-new-password">Confirm new password</label><input id="confirm-new-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your new password" minLength={8} required /></div>{error && <div className="form-error">{error}</div>}<div className="wizard-buttons"><button className="btn-next" style={{ flex: 1 }} type="submit" disabled={loading || submitting}>{submitting ? 'Updating password…' : 'Update password'}</button></div></form>}</div></div>
}

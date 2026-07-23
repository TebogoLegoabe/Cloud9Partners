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
  if (!loading && session) return <Navigate to="/dashboard" replace />

  const register = async () => {
    setError(null)
    if (!isSupabaseConfigured || !supabase) { setError('Authentication has not been configured for this environment yet.'); return }
    setSubmitting(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: { data: { first_name: account.firstName, last_name: account.lastName, phone: account.phone } },
      })
      if (signUpError) throw new Error(signUpError.message)
      if (!data.session) { setError('Check your email to confirm your account, then sign in to continue.'); setSubmitting(false); return }
      navigate('/request')
    } catch (err) { setError(err instanceof Error ? err.message : 'We could not create your account. Please try again.'); setSubmitting(false) }
  }

  return <div className="auth-shell"><div className="wizard auth-card registration-card"><Link to="/" className="wizard-logo logo"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link><div className="auth-heading"><span className="section-label">Your Cloud9 account</span><p className="step-sub">Register once, then submit and track all your services from one dashboard.</p></div><StepAccount data={account} onChange={setAccount} onNext={() => void register()} submitting={submitting} submitError={error} /></div></div>
}

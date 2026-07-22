import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import '../styles/wizard.css'

export default function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured yet — see frontend/.env.example.')
      return
    }
    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="wizard">
      <Link to="/" className="wizard-logo logo">
        <span className="l1">Cloud9</span> <span className="l2">Partners</span>
      </Link>

      <h2 className="step-title">Welcome back</h2>
      <p className="step-sub">Sign in to track your requests and quotes.</p>

      <form onSubmit={(e) => void handleSubmit(e)}>
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="thabo@example.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="wizard-buttons">
          <button className="btn-next" style={{ flex: 1 }} type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>

      <p className="wizard-footnote">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  )
}

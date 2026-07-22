import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AccountData } from './types'

interface Props {
  data: AccountData
  onChange: (data: AccountData) => void
  onNext: () => void
}

type Errors = Partial<Record<keyof AccountData, string>>

function validate(data: AccountData): Errors {
  const errors: Errors = {}
  if (!data.firstName.trim()) errors.firstName = 'Required'
  if (!data.lastName.trim()) errors.lastName = 'Required'
  if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Enter a valid email'
  if (data.phone.trim().length < 9) errors.phone = 'Enter your phone number'
  if (data.password.length < 8) errors.password = 'Minimum 8 characters'
  if (data.confirmPassword !== data.password) errors.confirmPassword = "Passwords don't match"
  return errors
}

export default function StepAccount({ data, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<Errors>({})

  const set = (field: keyof AccountData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [field]: e.target.value })

  const handleNext = () => {
    const found = validate(data)
    setErrors(found)
    if (Object.keys(found).length === 0) onNext()
  }

  return (
    <div>
      <h2 className="step-title">Create your account</h2>
      <p className="step-sub">Free to register. You only pay when you submit a request.</p>

      <div className="form-row">
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input id="firstName" value={data.firstName} onChange={set('firstName')} placeholder="Thabo" />
          {errors.firstName && <div className="field-error">{errors.firstName}</div>}
        </div>
        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" value={data.lastName} onChange={set('lastName')} placeholder="Mokoena" />
          {errors.lastName && <div className="field-error">{errors.lastName}</div>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" value={data.email} onChange={set('email')} placeholder="thabo@example.com" />
        {errors.email && <div className="field-error">{errors.email}</div>}
      </div>

      <div className="field">
        <label htmlFor="phone">Phone / WhatsApp</label>
        <input id="phone" type="tel" value={data.phone} onChange={set('phone')} placeholder="071 234 5678" />
        {errors.phone && <div className="field-error">{errors.phone}</div>}
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={data.password}
          onChange={set('password')}
          placeholder="At least 8 characters"
        />
        {errors.password && <div className="field-error">{errors.password}</div>}
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          type="password"
          value={data.confirmPassword}
          onChange={set('confirmPassword')}
          placeholder="Repeat your password"
        />
        {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
      </div>

      <div className="wizard-buttons">
        <button className="btn-next" style={{ flex: 1 }} onClick={handleNext}>
          Continue →
        </button>
      </div>
      <p className="wizard-footnote">
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  )
}

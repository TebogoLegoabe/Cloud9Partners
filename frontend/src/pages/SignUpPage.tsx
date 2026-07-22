import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/wizard/ProgressBar'
import StepAccount from '../components/wizard/StepAccount'
import StepService from '../components/wizard/StepService'
import StepDetails from '../components/wizard/StepDetails'
import StepReview from '../components/wizard/StepReview'
import StepSuccess from '../components/wizard/StepSuccess'
import { initialWizardData, type WizardData } from '../components/wizard/types'
import { api, redirectToPayfast } from '../lib/api'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import '../styles/wizard.css'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(initialWizardData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!data.serviceType) return
    setError(null)

    // Preview mode: without Supabase configured, just show the success screen.
    if (!isSupabaseConfigured || !supabase) {
      setStep(5)
      return
    }

    setSubmitting(true)
    try {
      // 1. Create the Supabase auth user (signs the user in).
      const { account, details, serviceType } = data
      const { error: signUpError } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
      })
      if (signUpError) throw new Error(signUpError.message)

      // 2. Create the profile row via the API.
      await api.createProfile({
        first_name: account.firstName,
        last_name: account.lastName,
        phone: account.phone,
        role: 'buyer',
      })

      // 3. Create the service request from the wizard answers.
      const request = await api.createRequest({
        service_type: serviceType,
        vehicle: details.hasSpecificVehicle
          ? {
              make: details.make || null,
              model: details.model || null,
              year: details.year || null,
              colour: details.colour || null,
              variant: details.variant || null,
            }
          : undefined,
        vehicle_type: details.vehicleType || undefined,
        preferred_brands: details.brands,
        budget: details.budget,
        condition: details.condition || undefined,
        payment_method: details.paymentMethod || undefined,
        province: details.province || undefined,
        timeline: details.timeline || undefined,
        contact_method: details.contactMethod || undefined,
        notes: details.notes || undefined,
      })

      // 4. Kick off the PayFast payment (redirects the browser away).
      const init = await api.initiatePayment(request.id)
      redirectToPayfast(init)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="wizard">
      <Link to="/" className="wizard-logo logo">
        <span className="l1">Cloud9</span> <span className="l2">Partners</span>
      </Link>

      {step <= 4 && <ProgressBar current={step} />}

      {step === 1 && (
        <StepAccount
          data={data.account}
          onChange={(account) => setData({ ...data, account })}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepService
          serviceType={data.serviceType}
          onChange={(serviceType) => setData({ ...data, serviceType })}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && data.serviceType && (
        <StepDetails
          serviceType={data.serviceType}
          data={data.details}
          onChange={(details) => setData({ ...data, details })}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && data.serviceType && (
        <StepReview
          serviceType={data.serviceType}
          details={data.details}
          submitting={submitting}
          error={error}
          onBack={() => setStep(3)}
          onSubmit={() => void submit()}
        />
      )}
      {step === 5 && <StepSuccess />}
    </div>
  )
}

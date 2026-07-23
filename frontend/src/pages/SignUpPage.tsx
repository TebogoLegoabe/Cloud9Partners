import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/wizard/ProgressBar'
import StepService from '../components/wizard/StepService'
import StepDetails from '../components/wizard/StepDetails'
import StepReview from '../components/wizard/StepReview'
import StepSuccess from '../components/wizard/StepSuccess'
import { initialWizardData, type WizardData } from '../components/wizard/types'
import { api, redirectToPayfast } from '../lib/api'
import '../styles/wizard.css'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(initialWizardData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [payLater, setPayLater] = useState(false)

  const saveRequest = async (): Promise<string | null> => {
    if (!data.serviceType) return null
    if (requestId) return requestId
    const details = data.details
    const request = await api.createRequest({
      service_type: data.serviceType,
      vehicle: details.hasSpecificVehicle ? { make: details.make || null, model: details.model || null, year: details.year || null, colour: details.colour || null, variant: details.variant || null } : undefined,
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
    setRequestId(request.id)
    return request.id
  }

  const complete = async (paymentChoice: 'now' | 'later') => {
    setError(null); setSubmitting(true)
    try {
      const savedRequestId = await saveRequest()
      if (!savedRequestId) throw new Error('Your request could not be saved.')
      if (paymentChoice === 'later') { setPayLater(true); setStep(4); setSubmitting(false); return }
      redirectToPayfast(await api.initiatePayment(savedRequestId))
    } catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.'); setSubmitting(false) }
  }

  return <div className="request-shell"><div className="wizard request-wizard">
    <div className="request-top"><Link to="/" className="wizard-logo logo"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link><Link to="/dashboard" className="dashboard-link">My dashboard</Link></div>
    {step <= 3 && <ProgressBar current={step} />}
    {step === 1 && <StepService serviceType={data.serviceType} onChange={(serviceType) => setData({ ...data, serviceType })} onBack={() => history.back()} onNext={() => setStep(2)} />}
    {step === 2 && data.serviceType && <StepDetails serviceType={data.serviceType} data={data.details} onChange={(details) => setData({ ...data, details })} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
    {step === 3 && data.serviceType && <StepReview serviceType={data.serviceType} details={data.details} submitting={submitting} error={error} onBack={() => setStep(2)} onPayNow={() => void complete('now')} onPayLater={() => void complete('later')} />}
    {step === 4 && <StepSuccess payLater={payLater} />}
  </div></div>
}

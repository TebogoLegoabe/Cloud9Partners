import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import { formatRands } from '../components/wizard/types'
import { useAuth } from '../context/AuthContext'
import { api, redirectToPayfast } from '../lib/api'
import type { ServiceRequest } from '../types'
import '../styles/wizard.css'

const STATUS_LABELS: Record<ServiceRequest['status'], string> = {
  pending_payment: 'Awaiting payment', active: 'In progress', quoting: 'Receiving quotes', completed: 'Completed', cancelled: 'Cancelled',
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => { api.listRequests().then(setRequests).catch(() => setRequests([])).finally(() => setLoading(false)) }, [])

  const payNow = async (requestId: string) => {
    setPaymentError(null); setPayingId(requestId)
    try { redirectToPayfast(await api.initiatePayment(requestId)) }
    catch (err) { setPaymentError(err instanceof Error ? err.message : 'Payment could not be started. Please try again.'); setPayingId(null) }
  }

  return <div><NavBar /><main className="dashboard-page">
    <div className="dashboard-heading"><div><span className="section-label">My account</span><h1>{profile ? `Hi ${profile.first_name}` : 'Your dashboard'}</h1><p>Track your requests, complete payment and compare quotes as they arrive.</p></div><Link to="/request" className="btn-primary">New service request →</Link></div>
    {paymentError && <div className="form-error">{paymentError}</div>}
    {loading ? <p className="dashboard-loading">Loading your requests…</p> : requests.length === 0 ? <div className="next-steps"><p className="next-steps-title">No requests yet</p><p>Start a new service request and it will appear here with its payment status and dealer quotes.</p></div> : <div className="request-list">{requests.map((request) => <article className="request-card" key={request.id}>
      <div className="request-card-head"><div><span>{request.service_type === 'consulting' ? 'Expert consulting' : 'Quote comparison'}</span><strong>{formatRands(request.budget)} budget</strong></div><span className={`request-status status-${request.status}`}>{STATUS_LABELS[request.status]}</span></div>
      <div className="request-meta"><span><small>Submitted</small>{new Date(request.created_at).toLocaleDateString('en-ZA')}</span><span><small>Advisory fee</small>{formatRands(request.advisory_fee_cents / 100)}</span></div>
      {request.status === 'pending_payment' && <div className="request-payment"><p>Your brief is saved. Complete payment when you’re ready to activate it.</p><button className="btn-primary" onClick={() => void payNow(request.id)} disabled={payingId === request.id}>{payingId === request.id ? 'Opening payment…' : `Pay ${formatRands(request.advisory_fee_cents / 100)} now →`}</button></div>}
    </article>)}</div>}
  </main></div>
}

import { useEffect, useState } from 'react'
import NavBar from '../components/layout/NavBar'
import { formatRands } from '../components/wizard/types'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import type { ServiceRequest } from '../types'
import '../styles/wizard.css'

const STATUS_LABELS: Record<ServiceRequest['status'], string> = {
  pending_payment: 'Awaiting payment',
  active: 'In progress',
  quoting: 'Receiving quotes',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .listRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <NavBar />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1rem 3rem' }}>
        <h2 className="step-title">
          {profile ? `Hi ${profile.first_name}` : 'Your dashboard'}
        </h2>
        <p className="step-sub">Track your requests and compare quotes as they arrive.</p>

        {loading ? (
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Loading your requests…</p>
        ) : requests.length === 0 ? (
          <div className="next-steps">
            <p className="next-steps-title">No requests yet</p>
            <p>
              Once you submit a request it will show up here, along with its status and any
              dealer quotes.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div className="summary" key={request.id}>
              <div className="summary-row">
                <span className="summary-key">Service</span>
                <span className="summary-value">
                  {request.service_type === 'consulting'
                    ? 'Expert consulting'
                    : 'Quote comparison'}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Budget</span>
                <span className="summary-value">{formatRands(request.budget)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Submitted</span>
                <span className="summary-value">
                  {new Date(request.created_at).toLocaleDateString('en-ZA')}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-key">Status</span>
                <span className="summary-fee">{STATUS_LABELS[request.status]}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

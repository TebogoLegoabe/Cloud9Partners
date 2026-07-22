import type { ServiceType } from '../../types'

interface Props {
  serviceType: ServiceType | null
  onChange: (serviceType: ServiceType) => void
  onBack: () => void
  onNext: () => void
}

const SERVICES: Array<{
  type: ServiceType
  name: string
  description: string
  fee: string
  badge?: string
}> = [
  {
    type: 'consulting',
    name: 'Expert consulting',
    description:
      'We research the market, shortlist the best options, and coach you through negotiating the deal.',
    fee: 'From R500 · + 10–15% of savings',
  },
  {
    type: 'quote_comparison',
    name: 'Quote comparison',
    description:
      'Approved dealers compete for your business. You compare quotes side by side and choose the best deal.',
    fee: 'From R750 · + 10–15% of savings',
    badge: 'Most popular',
  },
]

export default function StepService({ serviceType, onChange, onBack, onNext }: Props) {
  return (
    <div>
      <h2 className="step-title">What do you need help with?</h2>
      <p className="step-sub">Choose the service that fits your situation.</p>

      <div className="service-options">
        {SERVICES.map((service) => {
          const selected = serviceType === service.type
          return (
            <button
              key={service.type}
              type="button"
              className={`service-option ${selected ? 'selected' : ''}`}
              onClick={() => onChange(service.type)}
            >
              <span className="service-radio">{selected ? '✓' : ''}</span>
              {service.badge && <span className="badge">{service.badge}</span>}
              <div className="service-name">{service.name}</div>
              <div className="service-desc">{service.description}</div>
              <div className="service-fee">{service.fee}</div>
            </button>
          )
        })}
      </div>

      <div className="wizard-buttons">
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-next" onClick={onNext} disabled={!serviceType}>
          Continue →
        </button>
      </div>
    </div>
  )
}

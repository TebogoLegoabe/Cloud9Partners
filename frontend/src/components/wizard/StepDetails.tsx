import type { ServiceType } from '../../types'
import { formatRands, type DetailsData } from './types'

interface Props {
  serviceType: ServiceType
  data: DetailsData
  onChange: (data: DetailsData) => void
  onBack: () => void
  onNext: () => void
}

const VEHICLE_TYPES = ['Hatchback', 'Sedan', 'SUV / Crossover', 'Bakkie', 'MPV']
const BRANDS = [
  'Toyota', 'Volkswagen', 'Ford', 'Hyundai', 'Nissan', 'Kia', 'Haval',
  'Renault', 'BMW', 'Mercedes-Benz', 'Suzuki', 'Isuzu', 'Mazda', 'Any brand',
]
const CONDITIONS = ['New', 'Demo', 'Either']
const PAYMENT_METHODS = ['Finance', 'Cash']
const PROVINCES = [
  'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Limpopo',
  'Mpumalanga', 'North West', 'Free State', 'Northern Cape',
]
const TIMELINES = ['This month', '1 – 3 months', '3 – 6 months', 'Just browsing']
const CONTACT_METHODS = ['WhatsApp', 'Phone call', 'Email']

function OptionGroup({
  options,
  value,
  onSelect,
}: {
  options: string[]
  value: string
  onSelect: (option: string) => void
}) {
  return (
    <div className="option-buttons">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`option-button ${value === option ? 'selected' : ''}`}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default function StepDetails({ serviceType, data, onChange, onBack, onNext }: Props) {
  const set = <K extends keyof DetailsData>(field: K, value: DetailsData[K]) =>
    onChange({ ...data, [field]: value })

  const toggleBrand = (brand: string) =>
    set(
      'brands',
      data.brands.includes(brand)
        ? data.brands.filter((b) => b !== brand)
        : [...data.brands, brand],
    )

  const consulting = serviceType === 'consulting'

  return (
    <div>
      <h2 className="step-title">
        {consulting ? 'Tell us about your ideal car' : 'What are you looking for?'}
      </h2>
      <p className="step-sub">
        {consulting
          ? 'Our advisor will use this to find the best options for you.'
          : "We'll brief our dealer network and get competing quotes."}
      </p>

      <div className="field">
        <label>Do you have a specific vehicle in mind?</label>
        <div className="option-buttons">
          <button
            type="button"
            className={`option-button ${data.hasSpecificVehicle === true ? 'selected' : ''}`}
            onClick={() => set('hasSpecificVehicle', true)}
          >
            Yes, I know exactly what I want
          </button>
          <button
            type="button"
            className={`option-button ${data.hasSpecificVehicle === false ? 'selected' : ''}`}
            onClick={() => set('hasSpecificVehicle', false)}
          >
            No, help me choose
          </button>
        </div>
      </div>

      {data.hasSpecificVehicle && (
        <div className="vehicle-box">
          <div className="form-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="make">Make</label>
              <input
                id="make"
                value={data.make}
                onChange={(e) => set('make', e.target.value)}
                placeholder="e.g. Toyota"
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="model">Model</label>
              <input
                id="model"
                value={data.model}
                onChange={(e) => set('model', e.target.value)}
                placeholder="e.g. Fortuner"
              />
            </div>
          </div>
          <div className="form-row" style={{ marginTop: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="year">
                Year <span className="optional">optional</span>
              </label>
              <input
                id="year"
                value={data.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="e.g. 2026"
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="colour">
                Colour <span className="optional">optional</span>
              </label>
              <input
                id="colour"
                value={data.colour}
                onChange={(e) => set('colour', e.target.value)}
                placeholder="e.g. White"
              />
            </div>
          </div>
          <div className="field" style={{ marginTop: 12, marginBottom: 0 }}>
            <label htmlFor="variant">
              Variant / spec <span className="optional">optional</span>
            </label>
            <input
              id="variant"
              value={data.variant}
              onChange={(e) => set('variant', e.target.value)}
              placeholder="e.g. 2.8 GD-6 4x4 Auto, Epic edition"
            />
          </div>
        </div>
      )}

      <div className="divider">
        <span>{data.hasSpecificVehicle ? 'Additional preferences' : 'General preferences'}</span>
      </div>

      <div className="field">
        <label>Vehicle type</label>
        <OptionGroup
          options={VEHICLE_TYPES}
          value={data.vehicleType}
          onSelect={(v) => set('vehicleType', v)}
        />
      </div>

      <div className="field">
        <label>
          Preferred brands <span className="optional">select all that apply</span>
        </label>
        <div className="brand-pills">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              type="button"
              className={`brand-pill ${data.brands.includes(brand) ? 'selected' : ''}`}
              onClick={() => toggleBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>
          Budget — <span className="budget-value">{formatRands(data.budget)}</span>
        </label>
        <div className="range-wrap">
          <span>R80k</span>
          <input
            type="range"
            min={80000}
            max={800000}
            step={10000}
            value={data.budget}
            onChange={(e) => set('budget', Number(e.target.value))}
          />
          <span>R800k</span>
        </div>
      </div>

      <div className="field">
        <label>New or demo?</label>
        <OptionGroup
          options={CONDITIONS}
          value={data.condition}
          onSelect={(v) => set('condition', v)}
        />
      </div>

      <div className="field">
        <label>Finance or cash?</label>
        <OptionGroup
          options={PAYMENT_METHODS}
          value={data.paymentMethod}
          onSelect={(v) => set('paymentMethod', v)}
        />
      </div>

      <div className="field">
        <label htmlFor="province">Province</label>
        <select
          id="province"
          value={data.province}
          onChange={(e) => set('province', e.target.value)}
        >
          <option value="">Select your province</option>
          {PROVINCES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>How soon do you want to buy?</label>
        <OptionGroup
          options={TIMELINES}
          value={data.timeline}
          onSelect={(v) => set('timeline', v)}
        />
      </div>

      {consulting && (
        <div className="field">
          <label>Preferred contact method</label>
          <OptionGroup
            options={CONTACT_METHODS}
            value={data.contactMethod}
            onSelect={(v) => set('contactMethod', v)}
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="notes">
          Anything else? <span className="optional">optional</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          value={data.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Trade-in, must-have features, transmission preference..."
        />
      </div>

      <div className="wizard-buttons">
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-next" onClick={onNext}>
          Continue →
        </button>
      </div>
    </div>
  )
}

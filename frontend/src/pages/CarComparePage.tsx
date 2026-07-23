import { useState } from 'react'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import { api } from '../lib/api'
import type { CarComparison, CarComparisonVehicle } from '../types'
import '../styles/compare.css'

function VehicleResult({ vehicle, label }: { vehicle: CarComparisonVehicle; label: string }) {
  return <article className="ai-vehicle-card"><span className="compare-label">{label}</span><h2>{vehicle.name}</h2><div className="spec-pair"><div><small>Power</small><strong>{vehicle.power}</strong></div><div><small>Torque</small><strong>{vehicle.torque}</strong></div></div><div className="drivetrain"><small>Drivetrain</small><span>{vehicle.drivetrain}</span></div><div className="result-list"><h3>Standout features</h3><ul>{vehicle.key_features.map((item) => <li key={item}>{item}</li>)}</ul></div><div className="pros-cons"><div><h3>Strengths</h3><ul>{vehicle.strengths.map((item) => <li key={item}>+ {item}</li>)}</ul></div><div><h3>Trade-offs</h3><ul>{vehicle.tradeoffs.map((item) => <li key={item}>– {item}</li>)}</ul></div></div></article>
}

export default function CarComparePage() {
  const [carA, setCarA] = useState('')
  const [carB, setCarB] = useState('')
  const [priorities, setPriorities] = useState('')
  const [result, setResult] = useState<CarComparison | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const compare = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setResult(null); setLoading(true)
    try { setResult(await api.compareCars({ car_a: carA, car_b: carB, priorities })) }
    catch (err) { setError(err instanceof Error ? err.message : 'The comparison could not be completed.') }
    finally { setLoading(false) }
  }

  return <div><NavBar /><main className="compare-page"><section className="compare-hero"><div className="section-label">Cloud9 Car Compare AI</div><h1>Understand the cars—not just the specifications.</h1><p>Compare two vehicles and get a clear explanation of power, torque, features, practicality and which one better fits your life.</p></section><section className="compare-workspace"><form className="compare-form" onSubmit={(e) => void compare(e)}><div className="compare-fields"><div className="field"><label htmlFor="car-a">First vehicle</label><input id="car-a" value={carA} onChange={(e) => setCarA(e.target.value)} placeholder="e.g. 2025 VW Polo 1.0 TSI DSG" required /></div><div className="compare-versus">VS</div><div className="field"><label htmlFor="car-b">Second vehicle</label><input id="car-b" value={carB} onChange={(e) => setCarB(e.target.value)} placeholder="e.g. 2025 Toyota Starlet 1.5 XR" required /></div></div><div className="field"><label htmlFor="priorities">What matters most to you? <span className="optional">Optional</span></label><textarea id="priorities" rows={3} value={priorities} onChange={(e) => setPriorities(e.target.value)} placeholder="Daily commute, family space, overtaking power, fuel economy, safety features…" /></div>{error && <div className="form-error">{error}</div>}<button className="btn-primary compare-submit" type="submit" disabled={loading}>{loading ? 'Researching and comparing…' : 'Compare these cars →'}</button><p className="ai-disclaimer">AI can make mistakes. Confirm specifications, pricing and availability with the manufacturer or dealer before purchasing.</p></form>
      {loading && <div className="compare-loading"><div className="loading-orbit" /><h2>Building your comparison</h2><p>Checking specifications and translating the technical details into plain language.</p></div>}
      {result && <div className="compare-results"><div className="result-intro"><span className="status-pill">AI comparison complete</span><h1>{result.title}</h1><p>{result.summary}</p></div><div className="vehicle-results"><VehicleResult vehicle={result.car_a} label="Vehicle A" /><VehicleResult vehicle={result.car_b} label="Vehicle B" /></div><section className="terms-explained"><div className="section-label">In plain English</div><h2>What the numbers actually mean</h2><div>{result.plain_english.map((item) => <article key={item.term}><strong>{item.term}</strong><p>{item.explanation}</p></article>)}</div></section><section className="ai-verdict"><span>Cloud9 AI verdict</span><h2>{result.verdict}</h2><div><p><strong>{result.car_a.name} is best for:</strong> {result.best_for_a}</p><p><strong>{result.car_b.name} is best for:</strong> {result.best_for_b}</p></div></section><div className="comparison-note"><strong>Important context</strong><p>{result.important_note}</p></div>{result.sources.length > 0 && <div className="comparison-sources"><strong>Sources checked</strong>{result.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div>}</div>}
    </section></main><Footer /></div>
}

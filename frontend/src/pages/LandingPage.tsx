import { useNavigate } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import '../styles/landing.css'

const INSIGHTS = [
  { number: '01', title: 'Know the real market price', body: 'We benchmark comparable new and demo vehicles so you can separate a fair offer from an inflated sticker price.' },
  { number: '02', title: 'See the true cost of finance', body: 'We help you understand the rate, fees and total cost of credit before a monthly payment distracts from the numbers.' },
  { number: '03', title: 'Avoid expensive extras', body: 'We review optional add-ons and explain what is useful, negotiable or unnecessary for your specific deal.' },
]

const STEPS = [
  { title: 'Share your brief', body: 'Tell us your budget, preferred vehicles and whether you plan to finance or pay cash.' },
  { title: 'We analyse the market', body: 'Your advisor researches the market or briefs our dealer network to create real negotiating leverage.' },
  { title: 'Choose with confidence', body: 'Get clear recommendations, comparable offers and practical support before you commit.' },
]

const STATS = [
  { value: 'R12 400', label: 'Average client saving' },
  { value: '48 hrs', label: 'Typical turnaround' },
  { value: 'Nationwide', label: 'Fully online service' },
  { value: 'Independent', label: 'Buyer-first advice' },
]

const TESTIMONIALS = [
  { badge: 'Saved R16 000', quote: '“I would never have known what to ask for or how to push back. The process was clear from start to finish.”', name: 'Thabo M.', place: 'Sandton, Gauteng' },
  { badge: 'Saved R22 000 in finance', quote: '“The finance review alone was worth every rand. Cloud9 Partners caught the rate markup before I signed.”', name: 'Priya K.', place: 'Cape Town, Western Cape' },
  { badge: 'Bought with confidence', quote: '“I walked into the dealership knowing the numbers, the questions to ask and what I could confidently refuse.”', name: 'Lerato D.', place: 'Pretoria, Gauteng' },
]

const CONSULTING_FEATURES = ['Market research and shortlist', 'Negotiation coaching', 'Finance agreement review', 'Add-on guidance']
const COMPARISON_FEATURES = ['Multiple dealer quotes', 'Side-by-side comparison', 'Total cost analysis', 'Finance rate benchmarking']

function FeatureList({ items }: { items: string[] }) {
  return <ul className="service-features">{items.map((item) => <li key={item}><span className="tick" aria-hidden="true">✓</span>{item}</li>)}</ul>
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const goSignUp = () => navigate('/signup')
  const openCompare = () => navigate(session ? '/compare' : '/signin')

  return (
    <div>
      <NavBar />
      <main>
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-inner">
            <div className="eyebrow"><span /> Independent car-buying advice</div>
            <h1>A better car deal starts with someone <em>on your side.</em></h1>
            <p className="hero-sub">Expert guidance, transparent comparisons and practical negotiation support for South Africans buying new and demo vehicles.</p>
            <div className="hero-ctas">
              <button className="btn-primary btn-large" onClick={goSignUp}>Start your car brief <span aria-hidden="true">→</span></button>
              <a className="btn-outline btn-large" href="#services">Explore our services</a>
            </div>
            <div className="hero-trust" aria-label="Service benefits">
              {['Buyer-first advice', 'Online and nationwide', 'Clear, upfront pricing'].map((item) => <span key={item}><span className="check-dot">✓</span>{item}</span>)}
            </div>
          </div>
          <div className="deal-preview" aria-label="Example deal analysis">
            <div className="preview-header"><div><span className="preview-kicker">Illustrative deal review</span><strong>2025 compact SUV · Gauteng</strong></div><span className="status-pill">Review complete</span></div>
            <div className="preview-price"><span>Dealer proposal</span><strong>R486 900</strong></div>
            <div className="savings-breakdown" aria-label="Potential savings breakdown">
              <div><span><i className="saving-icon">01</i><span><strong>Vehicle price negotiation</strong><small>Compared with similar dealer offers</small></span></span><b>− R10 000</b></div>
              <div><span><i className="saving-icon">02</i><span><strong>Finance rate improvement</strong><small>Lower total cost over the selected term</small></span></span><b>− R6 150</b></div>
              <div><span><i className="saving-icon">03</i><span><strong>Optional add-on removed</strong><small>Product the buyer did not need</small></span></span><b>− R2 500</b></div>
            </div>
            <div className="saving-total"><span><small>Potential saving identified</small><strong>Reviewed deal estimate</strong></span><b>R18 650</b></div>
            <p className="preview-disclaimer">Example only. Actual savings depend on the vehicle, dealer and finance offer.</p>
          </div>
        </section>

        <section className="proof-strip"><p>Designed for buyers who want clarity before they sign</p><div><span>NEW VEHICLES</span><span>DEMO VEHICLES</span><span>CASH PURCHASES</span><span>VEHICLE FINANCE</span></div></section>

        <section className="section ai-preview-section"><div className="section-inner ai-preview-grid"><div className="ai-preview-copy"><div className="section-label">New · Cloud9 Car Compare AI</div><h2>Technical car specs, explained like a human.</h2><p>Compare two cars and understand what power, torque, drivetrain and features really mean for your daily drive—not just what they say on the brochure.</p><ul><li><span>✓</span> Current specifications researched</li><li><span>✓</span> Features compared side by side</li><li><span>✓</span> Balanced recommendation for your priorities</li></ul><button className="btn-primary btn-large" onClick={openCompare}>{session ? 'Compare cars now' : 'Sign in to compare cars'} <span>→</span></button><small>Available to registered Cloud9 customers.</small></div><div className="ai-preview-card"><div className="ai-card-top"><span className="ai-spark">AI</span><div><small>Example comparison</small><strong>Which one suits city life?</strong></div><span className="status-pill">Complete</span></div><div className="mini-car-head"><strong>VW Polo 1.0 TSI</strong><span>vs</span><strong>Toyota Starlet 1.5</strong></div><div className="mini-spec-grid"><div><small>Power</small><strong>Turbo flexibility</strong><p>Stronger low-down pull for easy overtaking.</p></div><div><small>Power</small><strong>Simple response</strong><p>Linear performance and easy everyday driving.</p></div><div><small>Torque</small><strong>Earlier delivery</strong><p>Feels more effortless from lower revs.</p></div><div><small>Ownership</small><strong>Value focused</strong><p>A practical choice for cost-conscious buyers.</p></div></div><div className="mini-verdict"><span>Plain-English verdict</span><p>Choose based on where and how you drive—not the biggest number on the page.</p></div></div></div></section>

        <section className="section insights">
          <div className="section-inner">
            <div className="section-heading split"><div><div className="section-label">Your advantage</div><h2>The numbers behind the deal matter.</h2></div><p>Dealerships negotiate every day. Most buyers do it once every few years. We help level the playing field.</p></div>
            <div className="insights-grid">{INSIGHTS.map((item) => <article className="insight-card" key={item.title}><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="section-inner">
            <div className="section-heading centered"><div className="section-label">How we help</div><h2>Choose the support that suits you.</h2><p>Whether you want an expert in your corner or competing quotes on the table, every recommendation starts with your interests.</p></div>
            <div className="services-grid">
              <article className="service-card"><div className="service-icon">01</div><h3>Expert consulting</h3><p>Personal research, deal review and practical coaching for buyers who want to remain in control.</p><FeatureList items={CONSULTING_FEATURES} /><div className="service-footer"><div><span>From</span><strong>R500</strong></div><button className="text-button" onClick={goSignUp}>Book a session →</button></div></article>
              <article className="service-card featured"><span className="badge">Most popular</span><div className="service-icon">02</div><h3>Quote comparison</h3><p>We take your brief to approved dealers, organise the offers and highlight the strongest overall deal.</p><FeatureList items={COMPARISON_FEATURES} /><div className="service-footer"><div><span>From</span><strong>R750</strong></div><button className="text-button" onClick={goSignUp}>Request quotes →</button></div></article>
            </div>
          </div>
        </section>

        <section className="section steps" id="how-it-works"><div className="section-inner"><div className="section-heading centered"><div className="section-label">Simple by design</div><h2>From brief to better deal in three steps.</h2></div><div className="steps-grid">{STEPS.map((step, i) => <article key={step.title}><div className="step-num">{String(i + 1).padStart(2, '0')}</div><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></div></section>

        <section className="stats"><div className="stats-grid">{STATS.map((stat) => <div key={stat.label}><div className="stat-value">{stat.value}</div><div className="stat-label">{stat.label}</div></div>)}</div></section>

        <section className="section testimonials"><div className="section-inner"><div className="section-heading centered"><div className="section-label">Client experiences</div><h2>Confidence you can measure.</h2></div><div className="testimonials-grid">{TESTIMONIALS.map((t) => <article className="testimonial-card" key={t.name}><div className="quote-mark">“</div><blockquote>{t.quote}</blockquote><div className="testimonial-bottom"><div><strong>{t.name}</strong><span>{t.place}</span></div><span className="badge">{t.badge}</span></div></article>)}</div></div></section>

        <section className="section pricing" id="pricing"><div className="pricing-inner"><div className="section-label">Transparent pricing</div><h2>Our value is tied to yours.</h2><p className="pricing-sub">You pay a clear advisory fee upfront, plus an agreed share of verified savings. If there is no saving, there is no savings share.</p><div className="pricing-note"><span>✓</span><div><strong>No hidden fees</strong><p>Scope and pricing are confirmed before work begins.</p></div><span>✓</span><div><strong>No dealer commission</strong><p>Our advice is designed around the buyer’s brief.</p></div></div></div></section>

        <section className="cta"><div><span className="eyebrow">Your next move</span><h2>Make your next car purchase a confident one.</h2><p>Start with a five-minute brief. We’ll help you understand the options and decide what comes next.</p><button className="btn-primary btn-large" onClick={goSignUp}>Get started today <span aria-hidden="true">→</span></button></div></section>
      </main>
      <Footer />
    </div>
  )
}

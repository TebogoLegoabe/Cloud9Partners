import { useNavigate } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import '../styles/landing.css'

const TRICKS = [
  {
    title: 'The sticker price is fake',
    body: "Every car has R10 000 – R20 000 of negotiation room built in. Dealers expect you to push back. Most buyers don't. They keep the difference.",
  },
  {
    title: 'Finance is where they really profit',
    body: 'Dealers mark up your interest rate and pocket the spread. On a R300 000 car that can cost you R40 000 extra over 72 months. Most buyers never find out.',
  },
  {
    title: 'The add-ons add up fast',
    body: 'Paint protection, GAP cover, extended warranty — each sounds small. Bundled into your monthly payment over 6 years, you could pay R25 000+ for products worth a fraction.',
  },
]

const STEPS = [
  {
    title: 'Tell us about your ideal car',
    body: 'Fill in a short form: budget, brands, new or demo, finance or cash. Takes 5 minutes.',
  },
  {
    title: 'We do the work',
    body: 'We research the market or brief our dealer network. You sit back while we build your advantage.',
  },
  {
    title: 'You negotiate from strength',
    body: 'Walk in with the data and scripts — or let us negotiate on your behalf. You drive away knowing you got the best deal.',
  },
]

const STATS = [
  { value: 'R12 400', label: 'Average saving per deal' },
  { value: '48hrs', label: 'Typical turnaround' },
  { value: '100%', label: 'Online, no office visits' },
  { value: '2', label: 'Services: new and demo' },
]

const TESTIMONIALS = [
  {
    badge: 'Saved R16 000',
    quote:
      '"I saved R16 000 on my new Hilux. I would never have known what to ask for or how to push back."',
    name: 'Thabo M.',
    place: 'Sandton, Gauteng',
  },
  {
    badge: 'Saved R22 000 in finance',
    quote:
      '"The finance review alone was worth every rand. My dealer had marked up my rate by 2.5%. Cloud9 Partners caught it before I signed."',
    name: 'Priya K.',
    place: 'Cape Town, Western Cape',
  },
  {
    badge: 'Saved R9 500',
    quote:
      '"I used to be terrified of dealerships. Now I walk in knowing exactly what to say and what to refuse. Total game changer."',
    name: 'Lerato D.',
    place: 'Pretoria, Gauteng',
  },
]

const CONSULTING_FEATURES = [
  'Market research and shortlist',
  'Negotiation coaching',
  'Finance agreement review',
  'Add-on guidance',
]

const COMPARISON_FEATURES = [
  'Multiple dealer quotes',
  'Side-by-side comparison',
  'Total cost of credit analysis',
  'Finance rate benchmarking',
]

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="service-features">
      {items.map((item) => (
        <li key={item}>
          <span className="tick">✓</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const goSignUp = () => navigate('/signup')

  return (
    <div>
      <NavBar />

      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow">South Africa's car buying advisor</span>
          <h1>
            Buy your next car
            <br />
            without getting ripped off.
          </h1>
          <p className="hero-sub">
            Cloud9 Partners puts a qualified expert in your corner — helping you choose the
            right car, negotiate the best price, and understand every line of your finance
            agreement before you sign.
          </p>
          <p className="hero-tagline">Every Rand. Every Deal. Every Time.</p>
          <div className="hero-ctas">
            <button
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: 15 }}
              onClick={goSignUp}
            >
              Get expert advice
            </button>
            <button
              className="btn-outline"
              style={{ padding: '13px 28px', fontSize: 15 }}
              onClick={goSignUp}
            >
              Compare dealer quotes
            </button>
          </div>
          <div className="hero-checks">
            {['New and demo cars', 'Online, nationwide', "100% on the buyer's side"].map(
              (item) => (
                <span key={item} className="hero-check">
                  <span className="check-dot">✓</span>
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section tricks">
        <div className="section-inner">
          <div className="section-label" style={{ color: 'var(--green-400)' }}>
            Why you need Cloud9 Partners
          </div>
          <h2>Dealerships are trained to make money off you</h2>
          <div className="tricks-grid">
            {TRICKS.map((trick, i) => (
              <div className="trick-card" key={trick.title}>
                <div className="trick-num">TRICK {String(i + 1).padStart(2, '0')}</div>
                <h3>{trick.title}</h3>
                <p>{trick.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="section-inner">
          <div className="section-label">Two ways we help</div>
          <h2>Choose the right service</h2>
          <p className="services-sub">
            Hands-on coaching or full quote comparison — we've got you covered.
          </p>
          <div className="services-grid">
            <div className="service-card">
              <h3>Expert consulting</h3>
              <p>
                Tell us your budget and preferences. We research the market, shortlist the
                best new and demo options, and coach you through the deal.
              </p>
              <FeatureList items={CONSULTING_FEATURES} />
              <div className="service-price">
                From <strong>R500</strong>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={goSignUp}>
                Book a session
              </button>
            </div>
            <div className="service-card featured">
              <span className="badge">Most popular</span>
              <h3>Quote comparison</h3>
              <p>
                We brief our network of approved dealers with your requirements. They compete
                for your business. You compare side by side and choose the best deal.
              </p>
              <FeatureList items={COMPARISON_FEATURES} />
              <div className="service-price">
                From <strong>R750</strong>
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={goSignUp}>
                Get quotes now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section steps" id="how-it-works">
        <div className="steps-inner">
          <div className="section-label">Simple process</div>
          <h2>Three steps to a better deal</h2>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <div className="step-num">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section testimonials">
        <div className="section-inner">
          <div className="section-label">What clients say</div>
          <h2>Real savings. Real stories.</h2>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <span className="badge">{t.badge}</span>
                <div className="stars">★★★★★</div>
                <blockquote>{t.quote}</blockquote>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-place">{t.place}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="pricing-inner">
          <div className="section-label">Transparent pricing</div>
          <h2>No surprises. No hidden costs.</h2>
          <p className="pricing-sub">
            You pay a flat advisory fee upfront, plus a small percentage of whatever we
            actually save you. If we save you nothing, the savings share is zero.
          </p>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-kicker">Consulting</div>
              <div className="price-amount">R500 – R1 500</div>
              <div className="price-note">flat fee + 10–15% of savings</div>
              <FeatureList items={CONSULTING_FEATURES} />
            </div>
            <div className="price-card featured">
              <span className="badge">Most popular</span>
              <div className="price-kicker">Quote comparison</div>
              <div className="price-amount">R750</div>
              <div className="price-note">flat fee + 10–15% of savings</div>
              <FeatureList
                items={[
                  'Brief to dealer network',
                  'Multiple competing quotes',
                  'Side-by-side comparison',
                  'Total cost of credit analysis',
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to stop overpaying?</h2>
        <p>Join South Africans who are buying cars the smart way.</p>
        <button
          className="btn-primary"
          style={{ padding: '16px 40px', fontSize: 16 }}
          onClick={goSignUp}
        >
          Get started today
        </button>
        <p className="cta-note">
          New and demo vehicles · Online, nationwide · No office visit needed
        </p>
      </section>

      <Footer />
    </div>
  )
}

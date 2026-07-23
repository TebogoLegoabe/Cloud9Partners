import { Link } from 'react-router-dom'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'
import '../styles/landing.css'

const TERMS = [
  ['Our service', 'Cloud9 Partners provides independent vehicle research, quote comparison and advisory support. We do not sell vehicles, provide credit, act as a financial adviser or guarantee that a dealer will accept a recommendation or proposed price.'],
  ['Your responsibilities', 'You agree to provide accurate information, review all dealer and finance documents carefully, and make your own final purchasing and financing decisions. You must be at least 18 years old and legally able to enter into an agreement.'],
  ['Fees and payment', 'The applicable scope, upfront fee and any savings-based fee will be shown or agreed before work starts. Third-party costs, vehicle prices, finance charges and dealer fees are separate from our service fee.'],
  ['Cancellations and refunds', 'Please contact us as soon as possible if you need to cancel. Refund eligibility depends on the work already completed, costs incurred and the terms confirmed when you purchased the service.'],
  ['Third-party offers', 'Dealer quotes, finance offers and vehicle information are supplied by third parties and may change or expire. We take reasonable care when presenting information but cannot warrant third-party accuracy or availability.'],
  ['Liability', 'To the extent permitted by South African law, Cloud9 Partners is not liable for indirect or consequential loss arising from a vehicle purchase, finance agreement or third-party service. Nothing in these terms limits rights that cannot lawfully be excluded.'],
  ['Changes and contact', 'We may update these terms when our services or legal obligations change. Questions can be sent to hello@cloud9partners.co.za.'],
]

const PRIVACY = [
  ['Information we collect', 'We may collect your name, contact details, account information, vehicle preferences, budget, location, service requests, payment references and communications with us. We do not store your full card details.'],
  ['How we use information', 'We use personal information to create and secure your account, provide requested services, obtain and compare relevant dealer offers, process payments, communicate with you, prevent misuse and improve our service.'],
  ['Who we share it with', 'We share only what is reasonably necessary with service providers such as our hosting, authentication and payment partners, and with selected dealers when you request quote comparison. We may also disclose information when required by law.'],
  ['Legal basis and consent', 'We process information to perform our agreement with you, comply with legal duties, pursue legitimate business interests and, where required, with your consent. You may withdraw consent for optional processing at any time.'],
  ['Storage and security', 'We use reasonable technical and organisational safeguards and retain information only for as long as needed for the purposes described, legal obligations, dispute resolution and fraud prevention. No online system can be guaranteed completely secure.'],
  ['Your choices and rights', 'Subject to applicable law, including POPIA, you may ask to access, correct or delete personal information, object to certain processing, or raise a privacy concern. Contact us at hello@cloud9partners.co.za.'],
  ['Cookies and updates', 'We may use essential browser storage or cookies for authentication and service operation. If we introduce optional analytics or marketing cookies, we will provide appropriate notice and choices. We may update this policy as our service evolves.'],
]

export default function LegalPage({ type }: { type: 'terms' | 'privacy' }) {
  const isTerms = type === 'terms'
  const sections = isTerms ? TERMS : PRIVACY
  return <div><NavBar /><main className="legal-page"><div className="legal-hero"><div className="section-label">Legal</div><h1>{isTerms ? 'Terms of Service' : 'Privacy Policy'}</h1><p>Last updated: 22 July 2026</p></div><div className="legal-content"><p className="legal-intro">{isTerms ? 'These terms explain the basis on which Cloud9 Partners provides its car-buying advisory services. By creating an account or purchasing a service, you agree to them.' : 'This policy explains how Cloud9 Partners collects, uses and protects personal information when you use our website and car-buying advisory services.'}</p>{sections.map(([title, body], i) => <section key={title}><span>{String(i + 1).padStart(2, '0')}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}<div className="legal-contact"><strong>Questions?</strong><p>Email <a href="mailto:hello@cloud9partners.co.za">hello@cloud9partners.co.za</a> or return to the <Link to="/">Cloud9 Partners homepage</Link>.</p></div></div></main><Footer /></div>
}

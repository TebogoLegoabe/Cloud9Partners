import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="footer"><div className="footer-inner"><div className="footer-brand"><Link to="/" className="logo"><span className="logo-mark">C9</span><span><span>Cloud9</span> <b>Partners</b></span></Link><p>Independent car-buying advice for South Africans who want to make informed decisions.</p></div><div className="footer-columns"><div><strong>Explore</strong><a href="/#services">Services</a><a href="/#how-it-works">How it works</a><a href="/#pricing">Pricing</a></div><div><strong>Company</strong><a href="mailto:hello@cloud9partners.co.za">Contact us</a><Link to="/terms">Terms of Service</Link><Link to="/privacy">Privacy Policy</Link></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Cloud9 Partners. All rights reserved.</span><span>Developed by <a href="https://www.codevmasters.com" target="_blank" rel="noreferrer">CodevMasters</a></span></div></footer>
}

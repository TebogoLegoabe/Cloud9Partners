export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="logo" style={{ fontSize: 17 }}>
            <span style={{ color: '#fff' }}>Cloud9</span>{' '}
            <span style={{ color: 'var(--green-400)' }}>Partners</span>
          </div>
          <div className="footer-tagline">Every Rand. Every Deal. Every Time.</div>
        </div>
        <div className="footer-links">
          <a href="/#how-it-works">How it works</a>
          <a href="/#services">Services</a>
          <a href="/#pricing">Pricing</a>
          <a href="mailto:hello@cloud9partners.co.za">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Cloud9 Partners. All rights reserved.</div>
        <div>Built for South Africa's car buyers.</div>
      </div>
    </footer>
  )
}

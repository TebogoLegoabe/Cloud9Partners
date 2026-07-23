import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NavBar() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main navigation">
        <Link to="/" className="logo" aria-label="Cloud9 Partners home"><span className="logo-mark">C9</span><span><span className="l1">Cloud9</span> <span className="l2">Partners</span></span></Link>
        <div className="nav-links"><a href="/#services">Services</a><Link to="/compare">Car Compare AI</Link><a href="/#how-it-works">How it works</a><a href="/#pricing">Pricing</a></div>
        <div className="nav-actions">
          {session ? <><button className="nav-login" onClick={() => navigate('/dashboard')}>Dashboard</button><button className="btn-primary nav-cta" onClick={() => void signOut()}>Sign out</button></> : <><button className="nav-login" onClick={() => navigate('/signin')}>Sign in</button><button className="btn-primary nav-cta" onClick={() => navigate('/signup')}>Get started</button></>}
        </div>
      </nav>
    </header>
  )
}

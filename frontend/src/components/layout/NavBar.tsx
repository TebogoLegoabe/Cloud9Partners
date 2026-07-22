import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function NavBar() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <span className="l1">Cloud9</span> <span className="l2">Partners</span>
      </Link>
      <ul className="nav-links">
        <li>
          <a href="/#how-it-works">How it works</a>
        </li>
        <li>
          <a href="/#services">Services</a>
        </li>
        <li>
          <a href="/#pricing">Pricing</a>
        </li>
      </ul>
      {session ? (
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-outline" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="btn-primary" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      ) : (
        <button className="btn-primary" onClick={() => navigate('/signup')}>
          Get started
        </button>
      )}
    </nav>
  )
}

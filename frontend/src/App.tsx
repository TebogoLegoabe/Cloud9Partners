import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignUpPage from './pages/SignUpPage'
import RegistrationPage from './pages/RegistrationPage'
import CarComparePage from './pages/CarComparePage'
import SignInPage from './pages/SignInPage'
import DashboardPage from './pages/DashboardPage'
import PaymentResultPage from './pages/PaymentResultPage'
import LegalPage from './pages/LegalPage'
import { useAuth } from './context/AuthContext'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth()
  if (loading) return null
  if (!session) return <Navigate to="/signin" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<RegistrationPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />
      <Route path="/payment/success" element={<PaymentResultPage outcome="success" />} />
      <Route path="/payment/cancelled" element={<PaymentResultPage outcome="cancelled" />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/request"
        element={
          <RequireAuth>
            <SignUpPage />
          </RequireAuth>
        }
      />
      <Route
        path="/compare"
        element={
          <RequireAuth>
            <CarComparePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import CVAnalyzer from './pages/CVAnalyzer'
import QuizGenerator from './pages/QuizGenerator'
import Auth from './pages/Auth'
import { AuthProvider, useAuth } from './context/AuthContext'
import './index.css'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon">⚡</div>
        <span>StudyForge <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
      </div>
      <div className="navbar-links">
        <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>Home</button>
        <button className={`nav-link ${location.pathname === '/cv' ? 'active' : ''}`} onClick={() => navigate('/cv')}>CV Analyzer</button>
        <button className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`} onClick={() => navigate('/quiz')}>Quiz Generator</button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              👤 {user.email}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>Çıkış</button>
          </div>
        ) : (
          location.pathname !== '/auth' && (
            <button className="btn btn-primary btn-sm" style={{ marginLeft: '12px' }} onClick={() => navigate('/auth')}>Giriş Yap</button>
          )
        )}
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1120',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cv" element={<ProtectedRoute><CVAnalyzer /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

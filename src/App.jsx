import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import CVAnalyzer from './pages/CVAnalyzer'
import QuizGenerator from './pages/QuizGenerator'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import RecoveryWorkspace from './pages/RecoveryWorkspace'
import Calendar from './pages/Calendar'
import FloatingAssistant from './components/FloatingAssistant'
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

import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const handleNav = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => handleNav('/')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <span>StudyForge <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
      </div>

      <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => handleNav('/')}>Home</button>
        <button className={`nav-link ${location.pathname === '/cv' ? 'active' : ''}`} onClick={() => handleNav('/cv')}>CV Analyzer</button>
        <button className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`} onClick={() => handleNav('/quiz')}>Study Workspace</button>
        <button className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`} onClick={() => handleNav('/calendar')}>Study Calendar</button>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => handleNav('/profile')}
              className={`btn ${location.pathname === '/profile' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{
                fontSize: '0.85rem',
                padding: '6px 12px',
                border: location.pathname === '/profile' ? '1px solid var(--accent-indigo)' : '1px solid var(--border)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span style={{ fontSize: '1rem', display: 'inline-block', lineHeight: 1 }}>👤</span>
              <span style={{ display: 'inline-block', lineHeight: 1 }}>
                {user.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : 'Profilim'}
              </span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>Çıkış</button>
          </div>
        ) : (
          location.pathname !== '/auth' && (
            <button className="btn btn-primary btn-sm" style={{ marginLeft: '12px' }} onClick={() => handleNav('/auth')}>Giriş Yap</button>
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
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/recovery" element={<ProtectedRoute><RecoveryWorkspace /></ProtectedRoute>} />
        </Routes>
        <FloatingAssistant />
      </BrowserRouter>
    </AuthProvider>
  )
}

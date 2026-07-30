import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import React, { Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import './index.css'

const Home = lazy(() => import('./pages/Home'))
const CVAnalyzer = lazy(() => import('./pages/CVAnalyzer'))
const QuizGenerator = lazy(() => import('./pages/QuizGenerator'))
const Auth = lazy(() => import('./pages/Auth'))
const Profile = lazy(() => import('./pages/Profile'))
const RecoveryWorkspace = lazy(() => import('./pages/RecoveryWorkspace'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Groups = lazy(() => import('./pages/Groups'))
const GroupDetails = lazy(() => import('./pages/GroupDetails'))
const FloatingAssistant = lazy(() => import('./components/FloatingAssistant'))

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
        <img src="/logo.png" alt="StudyForge AI Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        <span>StudyForge <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span></span>
      </div>

      <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <button className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => handleNav('/')}>Ana Sayfa</button>
        <button className={`nav-link ${location.pathname === '/cv' ? 'active' : ''}`} onClick={() => handleNav('/cv')}>CV Analyzer</button>
        <button className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`} onClick={() => handleNav('/quiz')}>Study Workspace</button>
        <button className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`} onClick={() => handleNav('/calendar')}>Study Calendar</button>
        <button className={`nav-link ${location.pathname.startsWith('/groups') ? 'active' : ''}`} onClick={() => handleNav('/groups')}>Gruplarım</button>
        
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
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Yükleniyor...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cv" element={<ProtectedRoute><CVAnalyzer /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute><QuizGenerator /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
            <Route path="/groups/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
            <Route path="/recovery" element={<ProtectedRoute><RecoveryWorkspace /></ProtectedRoute>} />
          </Routes>
          <FloatingAssistant />
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

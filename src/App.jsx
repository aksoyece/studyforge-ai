import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import CVAnalyzer from './pages/CVAnalyzer'
import QuizGenerator from './pages/QuizGenerator'
import './index.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

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
      </div>
    </nav>
  )
}

export default function App() {
  return (
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
        <Route path="/cv" element={<CVAnalyzer />} />
        <Route path="/quiz" element={<QuizGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}

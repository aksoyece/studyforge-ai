import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun.')
      return
    }
    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        const { error } = await signUp(email, password)
        if (error) throw error
        toast.success('Kayıt başarılı! Giriş yapabilirsiniz.')
        setIsRegister(false)
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        toast.success('Başarıyla giriş yapıldı!')
        navigate('/')
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Bir hata oluştu, lütfen bilgilerinizi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="card animate-fade-up" style={{ padding: '40px 32px', boxShadow: 'var(--shadow-glow-indigo)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>⚡</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {isRegister ? 'StudyForge AI ailesine katılın' : 'Yolculuğunuza kaldığınız yerden devam edin'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">E-posta Adresi</label>
              <input
                type="email"
                className="form-input"
                placeholder="ornek@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              {loading ? (
                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : (
                isRegister ? 'Kayıt Ol' : 'Giriş Yap'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {isRegister ? 'Zaten hesabınız var mı? ' : 'Hesabınız yok mu? '}
            </span>
            <button
              className="nav-link"
              style={{ padding: 0, color: 'var(--accent-indigo)', fontWeight: 600, display: 'inline', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: 'CV Analiz Sihirbazı',
    description: 'Özgeçmişinizi yükleyin ve başvuracağınız iş ilanını yapıştırın. AI-destekli eşleşme skoru, eksik anahtar kelimeler ve ATS analiz raporu alın.',
    path: '/cv',
    gradient: 'var(--gradient-primary)',
    glow: 'rgba(99,102,241,0.3)',
    badge: 'Claude / GPT-4o',
    badgeClass: 'badge-indigo',
    tags: ['Eşleşme Skoru', 'ATS Raporu', 'Anahtar Kelimeler', 'Ön Yazı'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10" />
        <path d="M6 10h10" />
        <path d="M6 14h10" />
      </svg>
    ),
    title: 'AI Study Workspace',
    description: 'PDF belgelerinizi yükleyin; yapay zeka sizin için akıllı özetler çıkarsın, 3D çalışma kartları (Flashcards) ve çözümlü testler hazırlasın.',
    path: '/quiz',
    gradient: 'var(--gradient-cyan)',
    glow: 'rgba(6,182,212,0.3)',
    badge: 'Claude / GPT-4o',
    badgeClass: 'badge-cyan',
    tags: ['Akıllı Özet', '3D Flashcards', 'Çözümlü Testler', 'Zorluk Derecesi'],
  },
]

const steps = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: 'Belgenizi Yükleyin',
    desc: 'PDF/Word belgenizi bırakın veya CV metninizi yapıştırın'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'AI Çözümlesin',
    desc: 'Claude veya GPT-4o saniyeler içinde analiz etmeye başlasın'
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    title: 'Sonuçları İnceleyin',
    desc: 'Detaylı analizlerinize ve quizlerinize profilinizden her zaman erişin'
  },
]

const techStack = [
  { name: 'React', color: '#61dafb' },
  { name: 'Vite', color: '#646cff' },
  { name: 'Supabase', color: '#3ecf8e' },
  { name: 'Claude', color: '#d4a27f' },
  { name: 'OpenAI', color: '#10a37f' },
]

export default function Home() {
  const navigate = useNavigate()
  const [mobileScreen, setMobileScreen] = useState('streak') // streak | flashcards | dashboard

  return (
    <div className="page" style={{ paddingTop: '64px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Blobs */}
      <div className="glow-blob glow-blob-primary" />
      <div className="glow-blob glow-blob-secondary" />

      {/* Hero */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="container animate-fade-up">
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-indigo" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
              ✨ Akıllı Çalışma ve Kariyer Asistanı
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            marginBottom: '24px',
            background: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}>
            Geleceğini Şekillendir,<br />Çalışmalarını Güçlendir.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.8,
          }}>
            İş başvurularınızı güçlendirmek için CV'nizi ATS uyumluluk testine sokun.
            Ya da dilediğiniz PDF belgesinden anında çözümlü ve dinamik testler oluşturun.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/cv')}>
              🎯 CV Analizi Yap
            </button>
            <button className="btn btn-secondary btn-lg" style={{ borderColor: 'var(--border-hover)' }} onClick={() => navigate('/quiz')}>
              📚 Study Workspace
            </button>
          </div>

          {/* Premium Dashboard Mockup Preview */}
          <div className="dashboard-mockup animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="mockup-header">
              <div className="mockup-dot" style={{ background: '#ff5f56' }} />
              <div className="mockup-dot" style={{ background: '#ffbd2e' }} />
              <div className="mockup-dot" style={{ background: '#27c93f' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: '12px', letterSpacing: '0.05em' }}>studyforge-ai.vercel.app/profile</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', textAlign: 'left' }}>
              {/* Left Panel Simulator */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Son Analiz Sonucu</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    border: '4px solid var(--accent-mint)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', color: 'var(--accent-mint)', fontSize: '0.9rem'
                  }}>
                    84%
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>Yazılım Mühendisi</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Eşleşme Oranı Yüksek</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  <span className="badge badge-mint" style={{ fontSize: '0.6rem' }}>TypeScript</span>
                  <span className="badge badge-mint" style={{ fontSize: '0.6rem' }}>Docker</span>
                  <span className="badge badge-rose" style={{ fontSize: '0.6rem' }}>CI/CD Eksik</span>
                </div>
              </div>

              {/* Right Panel Simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>Örnek Quiz Sorusu</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>Vite neden geleneksel araçlara kıyasla daha hızlıdır?</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'rgba(16,217,160,0.1)', border: '1px solid rgba(16,217,160,0.3)', borderRadius: '6px', color: 'var(--accent-mint)' }}>
                      A) Native ESM tabanlı çalıştığı için ✓
                    </div>
                    <div style={{ fontSize: '0.75rem', padding: '6px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)' }}>
                      B) Webpack motoru kullandığı için
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ padding: '60px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="grid-2">
            {features.map((f) => (
              <div
                key={f.path}
                className="card card-glow animate-fade-up"
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', padding: '36px' }}
                onClick={() => navigate(f.path)}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: f.gradient,
                }} />

                <div className="icon-container" style={{ marginBottom: '24px' }}>
                  {f.icon}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{f.title}</h2>
                  <span className={`badge ${f.badgeClass}`}>{f.badge}</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '24px' }}>
                  {f.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                  {f.tags.map(t => <span key={t} className="chip">{t}</span>)}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ background: f.gradient, boxShadow: `0 4px 20px ${f.glow}` }}
                >
                  Hemen Başla →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <p className="section-title" style={{ textAlign: 'center' }}>Nasıl Çalışır?</p>
          <div className="grid-3" style={{ marginTop: '40px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px' }}>
                <div className="icon-container" style={{ margin: '0 auto 20px', width: '56px', height: '56px', borderRadius: '50%', color: 'var(--accent-indigo)', background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.18)' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-indigo)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Aşama {i + 1}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', fontWeight: 700 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mobile Mockup Section */}
      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>📱 ÇOK YAKINDA</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>StudyForge Cebinizde</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Yakında yayınlanacak olan mobil uygulamamızla çalışma serinizi koruyabilir, flashcardlarınızı metroda, otobüste her yerde çalışabilirsiniz.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center',
            maxWidth: '850px',
            margin: '0 auto'
          }}>
            {/* Left: Controller Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => setMobileScreen('streak')}
                className="card"
                style={{
                  textAlign: 'left',
                  padding: '20px',
                  cursor: 'pointer',
                  border: mobileScreen === 'streak' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border)',
                  background: mobileScreen === 'streak' ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-card)',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🔥</span>
                  <h4 style={{ fontWeight: 700, color: mobileScreen === 'streak' ? '#f87171' : '#fff' }}>Günlük Çalışma Serisi</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Her gün çalışma motivasyonunuzu korumak için tasarlanan Duolingo tarzı seri takibi.
                </p>
              </button>

              <button 
                onClick={() => setMobileScreen('flashcards')}
                className="card"
                style={{
                  textAlign: 'left',
                  padding: '20px',
                  cursor: 'pointer',
                  border: mobileScreen === 'flashcards' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border)',
                  background: mobileScreen === 'flashcards' ? 'rgba(99, 102, 241, 0.04)' : 'var(--bg-card)',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>🗂️</span>
                  <h4 style={{ fontWeight: 700, color: mobileScreen === 'flashcards' ? '#818cf8' : '#fff' }}>Mobil Çalışma Kartları</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Ekranı kaydırarak çalışabileceğiniz, aktif hatırlama odaklı 3D kartlar.
                </p>
              </button>

              <button 
                onClick={() => setMobileScreen('dashboard')}
                className="card"
                style={{
                  textAlign: 'left',
                  padding: '20px',
                  cursor: 'pointer',
                  border: mobileScreen === 'dashboard' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border)',
                  background: mobileScreen === 'dashboard' ? 'rgba(6, 182, 212, 0.04)' : 'var(--bg-card)',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.25rem' }}>📈</span>
                  <h4 style={{ fontWeight: 700, color: mobileScreen === 'dashboard' ? '#22d3ee' : '#fff' }}>Kişisel İstatistikler</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Çözdüğünüz testlerin ve CV uyumluluk puanınızın anlık takibi.
                </p>
              </button>
            </div>

            {/* Right: Phone Frame Simulator */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="phone-mockup">
                {/* Phone Notch */}
                <div className="phone-notch" />
                {/* Screen Content */}
                <div className="phone-screen">
                  
                  {/* Streak view */}
                  {mobileScreen === 'streak' && (
                    <div className="phone-view animate-fade" style={{ background: '#090a10', display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        <span>StudyForge Mobile</span>
                        <span>10:42 AM</span>
                      </div>
                      
                      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <span className="streak-flame" style={{ fontSize: '5rem', display: 'inline-block', marginBottom: '16px' }}>🔥</span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>7 Günlük Seri!</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '200px', margin: '0 auto 24px' }}>
                          Harika gidiyorsun Ece! Bugünün hedefini tamamlamak için son 1 adım kaldı.
                        </p>
                        
                        {/* Weekly map preview */}
                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                              <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: i < 5 ? 'var(--gradient-rose)' : 'rgba(255,255,255,0.04)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.7rem', fontWeight: 700
                              }}>
                                {i < 5 ? '✓' : ''}
                              </div>
                              <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{d}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flashcards view */}
                  {mobileScreen === 'flashcards' && (
                    <div className="phone-view animate-fade" style={{ background: '#090a10', display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        <span>StudyForge Mobile</span>
                        <span>10:42 AM</span>
                      </div>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-indigo)', fontWeight: 600 }}>KART 3 / 10</span>
                        
                        {/* Simulated Small Flashcard */}
                        <div style={{
                          height: '180px', borderRadius: '16px',
                          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(255,255,255,0.02))',
                          border: '1px solid var(--border-hover)',
                          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                          padding: '20px', textAlign: 'center'
                        }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Soru / Terim</span>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.5 }}>Virtual DOM nedir ve ne işe yarar?</h4>
                        </div>
                        
                        <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Cevabı Gör</button>
                      </div>
                    </div>
                  )}

                  {/* Dashboard view */}
                  {mobileScreen === 'dashboard' && (
                    <div className="phone-view animate-fade" style={{ background: '#090a10', display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        <span>StudyForge Mobile</span>
                        <span>10:42 AM</span>
                      </div>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                        {/* Profile Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)' }} />
                          <div>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ece Aksoy</h4>
                            <span style={{ fontSize: '0.65rem', color: 'var(--accent-mint)' }}>Premium Öğrenci</span>
                          </div>
                        </div>

                        {/* CV Score Widget */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                            <span>CV Eşleşme Puanı</span>
                            <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>%78</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <div style={{ width: '78%', height: '100%', background: 'var(--gradient-primary)', borderRadius: '2px' }} />
                          </div>
                        </div>

                        {/* Quiz Stats Widget */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                            <span>Çözülen Soru Sayısı</span>
                            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>120 Soru</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                            <div style={{ width: '60%', height: '100%', background: 'var(--gradient-cyan)', borderRadius: '2px' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '40px 0 80px', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-title">Teknoloji Altyapısı</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
            {techStack.map(t => (
              <span key={t.name} className="chip" style={{ color: t.color, borderColor: t.color + '40', background: t.color + '12', padding: '8px 18px' }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

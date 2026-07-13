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

  // Interactive Live AI Demo States
  const [demoStep, setDemoStep] = useState('upload') // upload | analyzing | workspace
  const [demoActiveTab, setDemoActiveTab] = useState('chat') // summary | flashcards | quiz | chat
  const [demoChatMessages, setDemoChatMessages] = useState([
    { sender: 'ai', text: 'Merhaba! Yüklediğiniz "Binary Search Algorithm.pdf" dosyasıyla ilgili sormak istediğiniz soruları yanıtlayabilirim. Ne öğrenmek istersiniz?' }
  ])
  const [demoChatInput, setDemoChatInput] = useState('')
  const [demoChatLoading, setDemoChatLoading] = useState(false)
  const [demoFlashcardFlipped, setDemoFlashcardFlipped] = useState(false)
  const [demoQuizAnswered, setDemoQuizAnswered] = useState(null)

  // Dynamic Exam Countdown States
  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem('studyforge_exams')
      if (saved) return JSON.parse(saved)
    } catch(e){}
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return [{ id: 1, name: 'Veri Yapıları Vize Sınavı', date: d.toISOString().split('T')[0] }]
  })
  const [isAddingExam, setIsAddingExam] = useState(false)
  const [newExam, setNewExam] = useState({ name: '', date: '' })

  function saveNewExam() {
    if (!newExam.name || !newExam.date) return;
    const updated = [...exams, { id: Date.now(), ...newExam }]
    setExams(updated)
    localStorage.setItem('studyforge_exams', JSON.stringify(updated))
    setNewExam({ name: '', date: '' })
    setIsAddingExam(false)
  }

  function deleteExam(id) {
    const updated = exams.filter(e => e.id !== id)
    setExams(updated)
    localStorage.setItem('studyforge_exams', JSON.stringify(updated))
  }

  function calculateDaysRemaining(targetDate) {
    const target = new Date(targetDate)
    const today = new Date()
    target.setHours(0,0,0,0)
    today.setHours(0,0,0,0)
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  function startDemoAnalysis() {
    setDemoStep('analyzing')
    setTimeout(() => {
      setDemoStep('workspace')
    }, 2200)
  }

  function handleDemoSendChat() {
    if (!demoChatInput.trim() || demoChatLoading) return
    const userMsg = demoChatInput.trim()
    setDemoChatInput('')
    
    const updated = [...demoChatMessages, { sender: 'user', text: userMsg }]
    setDemoChatMessages(updated)
    setDemoChatLoading(true)

    setTimeout(() => {
      let aiResponse = 'Harika bir soru! İkili Arama (Binary Search) algoritması, sıralı bir dizide hedef elemanı bulmak için arama aralığını her adımda yarıya indiren son derece verimli bir algoritmadır. Çalışma zamanı karmaşıklığı O(log n) değeridir.'
      
      const normalized = userMsg.toLowerCase()
      if (normalized.includes('complex') || normalized.includes('time') || normalized.includes('hiz') || normalized.includes('karmaşik') || normalized.includes('o(')) {
        aiResponse = 'İkili arama (Binary Search), her adımda diziyi ortadan böldüğü için en kötü senaryoda bile **O(log n)** sürede çalışır. Örneğin 1 milyon elemanlı sıralı bir dizide aranan eleman maksimum 20 adımda kesinlikle bulunur!'
      } else if (normalized.includes('explain') || normalized.includes('anlat') || normalized.includes('nasil') || normalized.includes('nedir')) {
        aiResponse = 'Binary Search algoritmasının çalışma mantığı şöyledir:\n1. Dizinin tam ortasındaki elemana bakılır.\n2. Aranan değer ortadaki elemana eşitse arama biter.\n3. Aranan değer ortadaki elemandan küçükse sol yarıya, büyükse sağ yarıya odaklanılır.\n4. Bu işlem aralık sıfırlanana kadar tekrarlanır.'
      } else if (normalized.includes('quiz') || normalized.includes('soru')) {
        aiResponse = 'İşte İkili Arama ile ilgili hızlı bir soru:\n\n**Soru:** Binary Search algoritmasının çalışması için aranacak veri setinin hangi özelliğe sahip olması zorunludur?\n\n*İpucu: Verilerin sıralı (sorted) olması gerekir!*'
      }

      setDemoChatMessages([...updated, { sender: 'ai', text: aiResponse }])
      setDemoChatLoading(false)
    }, 1000)
  }

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

          {/* 1. Canlı İnteraktif AI Demo Workspace Simülatörü */}
          <div className="dashboard-mockup animate-fade-up" style={{ maxWidth: '850px', margin: '0 auto 48px', overflow: 'hidden' }}>
            <div className="mockup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <div className="mockup-dot" style={{ background: '#ff5f56' }} />
                <div className="mockup-dot" style={{ background: '#ffbd2e' }} />
                <div className="mockup-dot" style={{ background: '#27c93f' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: '12px' }}>studyforge-ai.vercel.app/demo-workspace</span>
              </div>
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Canlı Demo Simülatörü</span>
            </div>

            <div style={{ padding: '24px', background: 'rgba(9, 10, 16, 0.95)', borderBottomRightRadius: '16px', borderBottomLeftRadius: '16px' }}>
              {/* Step 1: Upload Simulator */}
              {demoStep === 'upload' && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }} className="animate-fade">
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Binary Search Algorithm.pdf</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                    Yapay zekanın bu dokümandan ders notları, özetler, flashcardlar ve quiz çıkarmasını görmek için analizi başlatın.
                  </p>
                  <button className="btn btn-primary" onClick={startDemoAnalysis} style={{ margin: '0 auto' }}>
                    ⚡ AI Analizini Başlat
                  </button>
                </div>
              )}

              {/* Step 2: Analyzing Simulator */}
              {demoStep === 'analyzing' && (
                <div style={{ textAlign: 'center', padding: '50px 20px' }} className="animate-fade">
                  <div className="spinner" style={{ borderTopColor: 'var(--accent-cyan)', margin: '0 auto 20px' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>Doküman Analiz Ediliyor...</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>İkili Arama Algoritması taranıyor, kavramlar ayrıştırılıyor.</p>
                </div>
              )}

              {/* Step 3: Workspace Simulator */}
              {demoStep === 'workspace' && (
                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                  
                  {/* Demo Navigation Tabs */}
                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <button 
                      onClick={() => setDemoActiveTab('summary')}
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: demoActiveTab === 'summary' ? 'var(--bg-card)' : 'transparent', color: demoActiveTab === 'summary' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      📝 Özet
                    </button>
                    <button 
                      onClick={() => setDemoActiveTab('flashcards')}
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: demoActiveTab === 'flashcards' ? 'var(--bg-card)' : 'transparent', color: demoActiveTab === 'flashcards' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      🗂️ Flashcards
                    </button>
                    <button 
                      onClick={() => setDemoActiveTab('quiz')}
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: demoActiveTab === 'quiz' ? 'var(--bg-card)' : 'transparent', color: demoActiveTab === 'quiz' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      🧠 Quiz
                    </button>
                    <button 
                      onClick={() => setDemoActiveTab('chat')}
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem', background: demoActiveTab === 'chat' ? 'var(--bg-card)' : 'transparent', color: demoActiveTab === 'chat' ? '#fff' : 'var(--text-secondary)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      🤖 AI Chat
                    </button>
                  </div>

                  {/* Demo Tab Content */}
                  <div style={{ minHeight: '220px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
                    
                    {/* Summary Tab */}
                    {demoActiveTab === 'summary' && (
                      <div className="animate-fade">
                        <h4 style={{ color: 'var(--accent-mint)', fontWeight: 700, marginBottom: '8px' }}>Akıllı Özet: İkili Arama (Binary Search)</h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
                          İkili Arama, sıralanmış bir dizide aranan elemanın bulunması için kullanılan **O(log n)** karmaşıklığına sahip hızlı bir algoritmadır. 
                          Her adımda arama aralığını yarıya indirerek çalışır. Web tarayıcılarında, veri indeksleme motorlarında ve sıralı listelerin hızlı taranmasında aktif rol oynar.
                        </p>
                        <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', paddingLeft: '16px', lineHeight: 1.6 }}>
                          <li><strong>Zorunluluk:</strong> Veri setinin kesinlikle sıralanmış olması gerekir.</li>
                          <li><strong>Çalışma Zamanı:</strong> O(log n) (1 milyon veriyi 20 adımda arar).</li>
                        </ul>
                      </div>
                    )}

                    {/* Flashcards Tab */}
                    {demoActiveTab === 'flashcards' && (
                      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                        <div 
                          onClick={() => setDemoFlashcardFlipped(!demoFlashcardFlipped)}
                          style={{
                            width: '100%', maxWidth: '340px', height: '140px',
                            background: demoFlashcardFlipped ? 'rgba(16, 217, 160, 0.06)' : 'rgba(99, 102, 241, 0.06)',
                            border: demoFlashcardFlipped ? '1px solid var(--accent-mint)' : '1px solid var(--accent-indigo)',
                            borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            alignItems: 'center', textAlign: 'center', padding: '16px', cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            {demoFlashcardFlipped ? '💡 CEVAP / AÇIKLAMA' : '❓ SORU / TERİM'}
                          </span>
                          <h5 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                            {demoFlashcardFlipped ? 'O(log n)' : 'Binary Search algoritmasının en kötü durum (Worst Case) karmaşıklığı nedir?'}
                          </h5>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Çevirmek için karta tıklayın</span>
                      </div>
                    )}

                    {/* Quiz Tab */}
                    {demoActiveTab === 'quiz' && (
                      <div className="animate-fade">
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>SORU 1 / 1</span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '8px 0 16px' }}>Binary Search algoritmasının çalışabilmesi için verilerin sahip olması gereken özellik nedir?</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button 
                            onClick={() => setDemoQuizAnswered('A')}
                            style={{
                              width: '100%', padding: '10px 14px', borderRadius: '6px', textAlign: 'left', fontSize: '0.8rem', border: '1px solid var(--border)',
                              background: demoQuizAnswered === 'A' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.02)',
                              borderColor: demoQuizAnswered === 'A' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border)',
                              color: demoQuizAnswered === 'A' ? '#f87171' : '#fff', cursor: 'pointer'
                            }}
                          >
                            A) Rastgele dağıtılmış olması (Yanlış cevap)
                          </button>
                          <button 
                            onClick={() => setDemoQuizAnswered('B')}
                            style={{
                              width: '100%', padding: '10px 14px', borderRadius: '6px', textAlign: 'left', fontSize: '0.8rem', border: '1px solid var(--border)',
                              background: demoQuizAnswered === 'B' ? 'rgba(16, 217, 160, 0.15)' : 'rgba(255,255,255,0.02)',
                              borderColor: demoQuizAnswered === 'B' ? 'var(--accent-mint)' : 'var(--border)',
                              color: demoQuizAnswered === 'B' ? 'var(--accent-mint)' : '#fff', cursor: 'pointer'
                            }}
                          >
                            B) Sıralı (Sorted) olması ✓ (Doğru cevap!)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Chat Tab */}
                    {demoActiveTab === 'chat' && (
                      <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ maxHeight: '160px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
                          {demoChatMessages.map((m, i) => (
                            <div key={i} style={{
                              padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', maxWidth: '85%', lineHeight: 1.4,
                              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                              background: m.sender === 'user' ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.03)',
                              border: m.sender === 'user' ? 'none' : '1px solid var(--border)',
                              color: '#fff'
                            }}>
                              {m.text}
                            </div>
                          ))}
                          {demoChatLoading && (
                            <div className="typing-dots">
                              <div className="typing-dot" />
                              <div className="typing-dot" />
                              <div className="typing-dot" />
                            </div>
                          )}
                        </div>

                        {/* Quick Action Questions */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span 
                            onClick={() => { setDemoChatInput('Hız karmaşıklığı nedir?'); }}
                            style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-hover)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          >
                            "Hız karmaşıklığı nedir?"
                          </span>
                          <span 
                            onClick={() => { setDemoChatInput('Çalışma mantığı nedir?'); }}
                            style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-hover)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                          >
                            "Çalışma mantığı nedir?"
                          </span>
                        </div>

                        {/* Chat input box */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input 
                            type="text"
                            placeholder="Soru sorun... (Örn: Hız karmaşıklığı nedir?)"
                            value={demoChatInput}
                            onChange={e => setDemoChatInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleDemoSendChat(); }}
                            style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem' }}
                          />
                          <button onClick={handleDemoSendChat} className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }}>Gönder</button>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Apple Tarzı Glassmorphic Study Dashboard Önizlemesi */}
          <div style={{ textAlign: 'center', marginTop: '64px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Your Study Dashboard</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gelişiminizi gerçek zamanlı takip eden modern, şık çalışma paneli.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            maxWidth: '850px',
            margin: '0 auto 80px'
          }}>
            {/* Widget 1: Streak */}
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>STUDY STREAK</span>
                <span className="streak-flame" style={{ fontSize: '1.5rem' }}>🔥</span>
              </div>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginBottom: '4px' }}>18 Days</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-mint)', fontWeight: 600 }}>Keep studying tomorrow!</p>
              
              {/* Streak bars indicator */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: '14px', borderRadius: '3px', background: i < 18 ? 'var(--gradient-rose)' : 'rgba(255,255,255,0.05)' }} />
                ))}
              </div>
            </div>

            {/* Widget 2: XP & Level */}
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>EXPERIENCE POINTS</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>LEVEL 4</span>
              </div>
              <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '4px' }}>1,240 XP</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sonraki Seviye için 260 XP gerekli</p>
              
              {/* Progress bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '22px' }}>
                <div style={{ width: '74%', height: '100%', background: 'var(--gradient-cyan)', borderRadius: '3px' }} />
              </div>
            </div>

            {/* Widget 3: Tasks & Exams */}
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>TODAY TASKS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--accent-mint)', background: 'rgba(16, 217, 160, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>Binary Search Özetini Oku</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--accent-indigo)', background: 'transparent' }} />
                  <span>5 Adet Flashcard Çöz</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--accent-indigo)', background: 'transparent' }} />
                  <span style={{ color: '#fff' }}>1 Adet Deneme Sınavı Tamamla</span>
                </div>
              </div>
            </div>

            {/* Widget 4: Exam Countdown */}
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(0, 0, 0, 0.2))', border: '1px solid rgba(239, 68, 68, 0.15)', display: 'flex', flexDirection: 'column', maxHeight: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase' }}>UPCOMING EXAMS</span>
                <button onClick={() => setIsAddingExam(!isAddingExam)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }} title="Yeni Sınav Ekle">➕</button>
              </div>

              <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
                {[...exams].sort((a,b) => new Date(a.date) - new Date(b.date)).map(exam => {
                  const daysLeft = calculateDaysRemaining(exam.date);
                  return (
                    <div key={exam.id} className="animate-fade" style={{ position: 'relative', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <button onClick={() => deleteExam(exam.id)} style={{ position: 'absolute', top: 0, right: 0, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }} title="Sil">✕</button>
                      <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171', marginBottom: '4px' }}>{daysLeft} Days</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingRight: '20px' }}>{exam.name}</p>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>
                        {new Date(exam.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )
                })}
                {exams.length === 0 && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px' }}>
                    Henüz sınav eklenmedi.
                  </div>
                )}
              </div>

              {isAddingExam && (
                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="text" value={newExam.name} onChange={e => setNewExam({...newExam, name: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '0.8rem' }} placeholder="Sınav Adı" />
                  <input type="date" value={newExam.date} onChange={e => setNewExam({...newExam, date: e.target.value})} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '0.8rem' }} />
                  <button onClick={saveNewExam} className="btn btn-primary btn-sm" style={{ padding: '6px', fontSize: '0.8rem', justifyContent: 'center' }}>Ekle</button>
                </div>
              )}
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

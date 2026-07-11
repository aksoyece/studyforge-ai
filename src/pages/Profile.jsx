import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAnalyses, getQuizSessions } from '../lib/supabase'
import toast from 'react-hot-toast'

// Simple regex markdown parser to avoid external packages
function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Headers
    .replace(/^#\s+(.+)$/gm, '<h1 style="font-size: 1.3rem; font-weight: 800; margin: 16px 0 8px 0; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">$1</h1>')
    .replace(/^##\s+(.+)$/gm, '<h2 style="font-size: 1.1rem; font-weight: 700; margin: 14px 0 6px 0; color: var(--accent-cyan); border-bottom: 1px solid var(--border); padding-bottom: 4px;">$1</h2>')
    .replace(/^###\s+(.+)$/gm, '<h3 style="font-size: 1.0rem; font-weight: 600; margin: 12px 0 6px 0; color: var(--text-primary);">$1</h3>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 750;">$1</strong>')
    
    // Bullet lists (ensure clean items inside lists)
    .replace(/^\s*-\s+(.+)$/gm, '<li style="margin-left: 16px; list-style-type: disc; margin-bottom: 6px; color: var(--text-secondary);">$1</li>')
    
    // Paragraph spacing (simple line breaks to double line breaks)
    .replace(/\n\n/g, '<div style="margin-bottom: 12px;"></div>')
    .replace(/\n/g, '<br/>')

  return html
}

export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('cv') // cv | quiz
  const [analyses, setAnalyses] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null) // Modalda gösterilecek detaylı öğe

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  async function loadUserData() {
    setLoading(true)
    try {
      const [analysesData, quizzesData] = await Promise.all([
        getAnalyses(),
        getQuizSessions()
      ])
      setAnalyses(analysesData)
      setQuizzes(quizzesData)
    } catch (err) {
      console.error(err)
      toast.error('Veriler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '850px' }}>
        
        {/* User Card */}
        <div className="card animate-fade-up" style={{
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.04))',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 'bold'
            }}>
              👤
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {user?.user_metadata?.full_name || 'Profil & Dashboard'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user?.email}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>{analyses.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>CV Analizi</div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{quizzes.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Çözülen Quiz</div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            className={`btn ${activeTab === 'cv' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('cv'); setSelectedItem(null); }}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            🎯 CV Analizlerim ({analyses.length})
          </button>
          <button
            className={`btn ${activeTab === 'quiz' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('quiz'); setSelectedItem(null); }}
            style={{
              flex: 1, justifyContent: 'center',
              background: activeTab === 'quiz' ? 'var(--gradient-cyan)' : 'var(--bg-card)',
              boxShadow: activeTab === 'quiz' ? '0 4px 20px rgba(6,182,212,0.2)' : 'none'
            }}
          >
            📚 Quiz Geçmişim ({quizzes.length})
          </button>
        </div>

        {loading ? (
          <div className="card loading-state">
            <div className="spinner" />
            <p>Geçmiş yükleniyor...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 1.2fr' : '1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* List */}
            <div className="animate-fade-up">
              {activeTab === 'cv' ? (
                analyses.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Henüz hiç CV analizi yapmadınız.
                  </div>
                ) : (
                  analyses.map(item => (
                    <div
                      key={item.id}
                      className={`history-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                      onClick={() => setSelectedItem(item)}
                      style={{ borderLeft: `4px solid ${selectedItem?.id === item.id ? 'var(--accent-indigo)' : 'transparent'}` }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.job_title || 'Yazılım Mühendisi'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(item.created_at).toLocaleDateString('tr-TR')} · {item.ai_provider}
                        </div>
                      </div>
                      <span style={{
                        fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem',
                        color: item.analysis_result?.matchScore >= 75 ? 'var(--accent-mint)' : 'var(--accent-rose)'
                      }}>
                        {item.analysis_result?.matchScore}%
                      </span>
                    </div>
                  ))
                )
              ) : (
                quizzes.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Henüz hiç quiz çözmediniz.
                  </div>
                ) : (
                  quizzes.map(item => {
                    const qList = Array.isArray(item.questions) ? item.questions : (item.questions?.qs || [])
                    return (
                      <div
                        key={item.id}
                        className={`history-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                        onClick={() => setSelectedItem(item)}
                        style={{ borderLeft: `4px solid ${selectedItem?.id === item.id ? 'var(--accent-cyan)' : 'transparent'}` }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.pdf_name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {new Date(item.created_at).toLocaleDateString('tr-TR')} · {qList.length} Öğe / Soru
                          </div>
                        </div>
                        <span className="badge badge-cyan">{item.ai_provider}</span>
                      </div>
                    )
                  })
                )
              )}
            </div>

            {/* Details panel */}
            {selectedItem && (
              <div className="card animate-fade-up" style={{ position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <p className="section-title" style={{ marginBottom: 0 }}>Detaylar</p>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelectedItem(null)}>Kapat</button>
                </div>

                {activeTab === 'cv' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{selectedItem.job_title}</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge badge-indigo">Match Score: {selectedItem.analysis_result?.matchScore}%</span>
                        <span className="badge badge-mint">{selectedItem.ai_provider}</span>
                      </div>
                    </div>
                    <hr className="divider" style={{ margin: '12px 0' }} />
                    
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Özet</h4>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{selectedItem.analysis_result?.summary}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-mint)', textTransform: 'uppercase', marginBottom: '8px' }}>Güçlü Yönler</h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {selectedItem.analysis_result?.strengths?.map((s, i) => <li key={i} style={{ marginBottom: '4px' }}>{s}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-rose)', textTransform: 'uppercase', marginBottom: '8px' }}>Geliştirilmesi Gerekenler</h4>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {selectedItem.analysis_result?.gaps?.map((g, i) => <li key={i} style={{ marginBottom: '4px' }}>{g}</li>)}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', wordBreak: 'break-all' }}>{selectedItem.pdf_name}</h3>
                      <span className="badge badge-cyan">
                        {Array.isArray(selectedItem.questions) 
                          ? `${selectedItem.questions.length} Soru` 
                          : `${selectedItem.questions?.qs?.length || 0} Soru & Materyal`}
                      </span>
                    </div>
                    <hr className="divider" style={{ margin: '12px 0' }} />
                    
                    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                      {/* Show Summary details if it exists in new schema */}
                      {!Array.isArray(selectedItem.questions) && selectedItem.questions?.summary && (
                        <div style={{ marginBottom: '24px' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>Doküman Özeti</h4>
                          <div 
                            style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedItem.questions.summary) }}
                          />
                        </div>
                      )}

                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Sorular</h4>
                      {(Array.isArray(selectedItem.questions) ? selectedItem.questions : (selectedItem.questions?.qs || [])).map((q, i) => (
                        <div key={i} style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '8px' }}>{i + 1}. {q.question}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '8px' }}>
                            {q.options?.map((opt, oIdx) => (
                              <span key={oIdx} style={{
                                fontSize: '0.8rem',
                                color: oIdx === q.correctIndex ? 'var(--accent-mint)' : 'var(--text-secondary)',
                                fontWeight: oIdx === q.correctIndex ? 600 : 400
                              }}>
                                {opt} {oIdx === q.correctIndex && '✓'}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

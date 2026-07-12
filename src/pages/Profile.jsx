import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAnalyses, getQuizSessions, getQuizResults } from '../lib/supabase'
import { analyzeWeaknesses_Claude } from '../lib/claude'
import { analyzeWeaknesses_OpenAI } from '../lib/openai'
import { getMockWeaknessAnalysis } from '../lib/mockAI'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('cv') // cv | quiz
  const [analyses, setAnalyses] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [weaknesses, setWeaknesses] = useState([])
  const [analyzingWeaknesses, setAnalyzingWeaknesses] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null) // Modalda gösterilecek detaylı öğe
  
  // Gamification States
  const [streak, setStreak] = useState(0)
  const [activityMap, setActivityMap] = useState({})

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  async function loadUserData() {
    setLoading(true)
    try {
      const [analysesData, quizzesData, resultsData] = await Promise.all([
        getAnalyses(),
        getQuizSessions(),
        getQuizResults()
      ])
      setAnalyses(analysesData)
      setQuizzes(quizzesData)

      // Calculate Gamification: Streak & Heatmap
      const allActivities = [...analysesData, ...quizzesData]
      const datesMap = {}
      
      allActivities.forEach(act => {
        if (!act.created_at) return
        const dateStr = new Date(act.created_at).toISOString().split('T')[0]
        datesMap[dateStr] = (datesMap[dateStr] || 0) + 1
      })
      setActivityMap(datesMap)

      // Calculate Streak
      const uniqueDates = new Set(Object.keys(datesMap))
      let currentStreak = 0
      let checkDate = new Date()
      let dateString = checkDate.toISOString().split('T')[0]

      // If active today or yesterday, check backward
      if (uniqueDates.has(dateString)) {
        while (uniqueDates.has(dateString)) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
          dateString = checkDate.toISOString().split('T')[0]
        }
      } else {
        // Check if active yesterday (so streak doesn't die instantly today)
        checkDate.setDate(checkDate.getDate() - 1)
        dateString = checkDate.toISOString().split('T')[0]
        if (uniqueDates.has(dateString)) {
          while (uniqueDates.has(dateString)) {
            currentStreak++
            checkDate.setDate(checkDate.getDate() - 1)
            dateString = checkDate.toISOString().split('T')[0]
          }
        }
      }
      setStreak(currentStreak)

      // Get all wrong questions across all quiz results
      const allWrongQs = resultsData.reduce((acc, curr) => {
        if (curr.wrong_questions && Array.isArray(curr.wrong_questions)) {
          acc.push(...curr.wrong_questions)
        }
        return acc
      }, [])

      if (allWrongQs.length > 0) {
        setAnalyzingWeaknesses(true)
        const CLAUDE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
        const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY
        const hasClaude = CLAUDE_KEY && CLAUDE_KEY !== 'your_claude_api_key_here'
        const hasOpenAI = OPENAI_KEY && OPENAI_KEY !== 'your_openai_api_key_here'

        try {
          let analysis = []
          if (hasClaude) {
            analysis = await analyzeWeaknesses_Claude(allWrongQs.slice(0, 15))
          } else if (hasOpenAI) {
            analysis = await analyzeWeaknesses_OpenAI(allWrongQs.slice(0, 15))
          } else {
            // Fallback mock
            analysis = getMockWeaknessAnalysis()
          }
          setWeaknesses(analysis)
        } catch (err) {
          console.error('Weakness analysis error:', err)
          setWeaknesses(getMockWeaknessAnalysis())
        } finally {
          setAnalyzingWeaknesses(false)
        }
      }
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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

            {/* Streak Badge */}
            <div className="streak-badge-glow" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              boxShadow: streak > 0 ? '0 0 15px rgba(239, 68, 68, 0.15)' : 'none'
            }}>
              <span className="streak-flame" style={{ fontSize: '1.3rem', display: 'inline-block' }}>
                {streak > 0 ? '🔥' : '💀'}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: streak > 0 ? '#f87171' : 'var(--text-secondary)' }}>
                {streak} Günlük Seri
              </span>
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

        {/* GitHub-style Activity Heatmap */}
        <div className="card animate-fade-up" style={{ marginBottom: '32px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>📅</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Çalışma Takvimi</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Son 12 Hafta (Aktivite Yoğunluğu)</span>
          </div>

          {/* Heatmap Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              minWidth: '580px',
              alignItems: 'center'
            }}>
              {/* Day of Week Labels */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '204px', /* 7 cells * 24px + 6 gaps * 6px */
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                paddingRight: '4px',
                textAlign: 'right',
                width: '32px'
              }}>
                <span>Pzt</span>
                <span>Sal</span>
                <span>Çar</span>
                <span>Per</span>
                <span>Cum</span>
                <span>Cmt</span>
                <span>Paz</span>
              </div>

              {/* Grid Wrapper */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, minmax(40px, 1fr))',
                gap: '6px',
                flex: 1
              }}>
                {Array.from({ length: 12 }).map((_, weekIdx) => {
                  return (
                    <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const dayCount = (weekIdx * 7) + dayIdx;
                      // Calculate date for this cell (going backwards from today to 84 days ago)
                      const targetDate = new Date();
                      targetDate.setDate(targetDate.getDate() - (83 - dayCount));
                      const dateStr = targetDate.toISOString().split('T')[0];
                      const activityCount = activityMap[dateStr] || 0;

                      // Color based on activity count
                      let bg = 'rgba(255, 255, 255, 0.03)';
                      let border = '1px solid rgba(255, 255, 255, 0.03)';
                      if (activityCount === 1) {
                        bg = 'rgba(16, 217, 160, 0.2)';
                        border = '1px solid rgba(16, 217, 160, 0.3)';
                      } else if (activityCount === 2) {
                        bg = 'rgba(16, 217, 160, 0.5)';
                        border = '1px solid rgba(16, 217, 160, 0.6)';
                      } else if (activityCount >= 3) {
                        bg = 'var(--accent-mint)';
                        border = '1px solid var(--accent-mint)';
                      }

                      const options = { month: 'short', day: 'numeric' };
                      const labelDate = targetDate.toLocaleDateString('tr-TR', options);

                      return (
                        <div
                          key={dayIdx}
                          title={`${labelDate}: ${activityCount} Aktivite`}
                          style={{
                            height: '24px',
                            borderRadius: '4px',
                            background: bg,
                            border: border,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: activityCount > 0 ? '#fff' : 'transparent',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                          }}
                          className="heatmap-cell"
                        >
                          {activityCount > 0 ? activityCount : ''}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              </div> {/* Close Grid Wrapper */}
            </div> {/* Close Flex Wrapper */}
            
            {/* Heatmap Legend */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <span>Daha Az</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.03)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(16, 217, 160, 0.2)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(16, 217, 160, 0.5)' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--accent-mint)' }} />
              </div>
              <span>Daha Çok</span>
            </div>
          </div>
        </div>

        {/* AI Weakness & Recovery Card */}
        {weaknesses.length > 0 && (
          <div className="card animate-fade-up" style={{
            marginBottom: '32px',
            border: '1px solid rgba(99,102,241,0.2)',
            background: 'linear-gradient(180deg, rgba(13,17,32,0.8) 0%, rgba(9,11,20,0.9) 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.25rem' }}>🧠</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Kişiselleştirilmiş Gelişim Raporu</h3>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              Yapay zeka çözdüğünüz tüm quizlerdeki yanlış cevaplarınızı analiz etti. İşte en çok zorlandığınız konu başlıkları ve telafi önerileri:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {weaknesses.map((w, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{w.topic}</span>
                    <span style={{ color: w.percentage >= 70 ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                      Hata Oranı: %{w.percentage}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${w.percentage}%`,
                      height: '100%',
                      background: w.percentage >= 70 ? 'var(--gradient-rose)' : 'var(--gradient-cyan)',
                      borderRadius: '3px'
                    }} />
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    💡 <strong>Öneri:</strong> {w.recommendation}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/recovery', { state: { weakTopics: weaknesses.map(w => w.topic) } })}
                style={{
                  background: 'var(--gradient-rose)',
                  boxShadow: '0 4px 20px rgba(244,63,94,0.3)',
                  padding: '12px 28px'
                }}
              >
                🔥 AI Kurtarma Testi Başlat (Eksiklerini Kapat)
              </button>
            </div>
          </div>
        )}

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

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { generateRecoveryQuiz_Claude } from '../lib/claude'
import { generateRecoveryQuiz_OpenAI } from '../lib/openai'
import { getMockRecoveryQuiz } from '../lib/mockAI'

export default function RecoveryWorkspace() {
  const location = useLocation()
  const navigate = useNavigate()
  const weakTopics = location.state?.weakTopics || []

  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  const CLAUDE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY
  const hasClaude = CLAUDE_KEY && CLAUDE_KEY !== 'your_claude_api_key_here'
  const hasOpenAI = OPENAI_KEY && OPENAI_KEY !== 'your_openai_api_key_here'

  useEffect(() => {
    if (weakTopics.length === 0) {
      toast.error('Zayıf konu bilgisi bulunamadı.')
      navigate('/profile')
      return
    }
    loadRecoveryQuiz()
  }, [])

  async function loadRecoveryQuiz() {
    setLoading(true)
    try {
      let qs = []
      if (hasClaude) {
        qs = await generateRecoveryQuiz_Claude(weakTopics)
      } else if (hasOpenAI) {
        qs = await generateRecoveryQuiz_OpenAI(weakTopics)
      } else {
        // Fallback mock
        await new Promise(r => setTimeout(r, 1500))
        qs = getMockRecoveryQuiz()
      }
      setQuestions(qs)
    } catch (err) {
      console.error(err)
      toast.error('Kurtarma quizi üretilirken hata oluştu. Örnek test başlatılıyor.')
      setQuestions(getMockRecoveryQuiz())
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(optIdx) {
    if (answered) return
    setSelected(optIdx)
    setAnswered(true)
  }

  function handleNext() {
    if (selected === questions[currentQ].correctIndex) {
      setScore(s => s + 1)
    }

    if (currentQ + 1 >= questions.length) {
      setQuizFinished(true)
    } else {
      setCurrentQ(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div className="card loading-state" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div className="spinner" style={{ borderTopColor: 'var(--accent-rose)' }} />
          <p style={{ fontWeight: 600 }}>Kurtarma Sınavı Hazırlanıyor...</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI zayıf olduğunuz konulara özel sorular tasarlıyor.</p>
        </div>
      </div>
    )
  }

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Red/Indigo Glow */}
      <div className="glow-blob glow-blob-primary" style={{ background: 'radial-gradient(circle, var(--accent-rose) 0%, transparent 70%)' }} />
      
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '680px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.25rem' }}>🔥</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Kurtarma Sınavı</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Zayıf noktalarınızı kapatmak için kişiselleştirilmiş 5 soru.</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>Sınavdan Çık</button>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          {!quizFinished ? (
            <div>
              {/* Question progress */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span>Soru {currentQ + 1} / {questions.length}</span>
                  <span style={{ color: 'var(--accent-rose)', fontWeight: 600 }}>Kurtarma Modu</span>
                </div>
                <div className="quiz-progress-bar-wrap">
                  <div className="quiz-progress-bar-fill" style={{ width: `${((currentQ) / questions.length) * 100}%`, background: 'var(--gradient-rose)' }} />
                </div>
              </div>

              {/* Question card */}
              <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, rgba(244,63,94,0.06), rgba(99,102,241,0.04))', border: '1px solid rgba(244,63,94,0.15)' }}>
                <h3 style={{ fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 600 }}>
                  {questions[currentQ].question}
                </h3>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {questions[currentQ].options.map((opt, i) => {
                  let cls = 'quiz-option'
                  if (answered) {
                    if (i === questions[currentQ].correctIndex) cls += ' correct'
                    else if (i === selected) cls += ' wrong'
                  }
                  return (
                    <button 
                      key={i} 
                      className={cls} 
                      disabled={answered} 
                      onClick={() => handleSelect(i)}
                      style={{
                        borderColor: answered && i === questions[currentQ].correctIndex ? 'var(--accent-mint)' : answered && i === selected ? 'var(--accent-rose)' : 'var(--border)'
                      }}
                    >
                      <span className="option-letter" style={{ background: answered && i === questions[currentQ].correctIndex ? 'rgba(16,217,160,0.2)' : answered && i === selected ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.03)' }}>{letters[i]}</span>
                      {opt.replace(/^[A-D]\)\s*/, '')}
                    </button>
                  )
                })}
              </div>

              {/* Explanation */}
              {answered && (
                <div className="animate-fade">
                  <div style={{
                    padding: '16px 20px', borderRadius: 'var(--radius-md)',
                    background: selected === questions[currentQ].correctIndex ? 'rgba(16,217,160,0.08)' : 'rgba(244,63,94,0.08)',
                    border: `1px solid ${selected === questions[currentQ].correctIndex ? 'rgba(16,217,160,0.25)' : 'rgba(244,63,94,0.25)'}`,
                    marginBottom: '16px'
                  }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: selected === questions[currentQ].correctIndex ? 'var(--accent-mint)' : 'var(--accent-rose)' }}>
                      {selected === questions[currentQ].correctIndex ? '✅ Doğru!' : '❌ Yanlış'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {questions[currentQ].explanation}
                    </p>
                  </div>

                  <button className="btn btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', background: 'var(--gradient-rose)' }}>
                    {currentQ + 1 === questions.length ? '🏁 Kurtarma Sınavını Tamamla' : 'Sonraki Soru →'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fade-up" style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏆</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Kurtarma Sınavı Tamamlandı!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                5 sorudan {score} tanesini başarıyla cevaplayarak eksiklerinizi tamamladınız.
              </p>

              <button className="btn btn-primary" onClick={() => navigate('/profile')} style={{ background: 'var(--gradient-primary)' }}>
                Dashboarda Dön
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

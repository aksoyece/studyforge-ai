import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { generateQuiz_Claude } from '../lib/claude'
import { generateQuiz_OpenAI } from '../lib/openai'
import { saveQuizSession, saveQuizResult, getQuizSessions } from '../lib/supabase'
import { getMockQuiz } from '../lib/mockAI'
import { extractTextFromPDF } from '../lib/pdfExtract'

// ── Quiz Question Component ───────────────────────────────────────
function QuizQuestion({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)

  function handleSelect(optIdx) {
    if (answered) return
    setSelected(optIdx)
    setAnswered(true)
  }

  const isLast = index + 1 === total
  const letters = ['A', 'B', 'C', 'D']

  return (
    <div className="animate-fade-up">
      {/* Progress */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem',
          color: 'var(--text-secondary)', marginBottom: '8px' }}>
          <span>Soru {index + 1} / {total}</span>
          <span>{Math.round((index / total) * 100)}% tamamlandı</span>
        </div>
        <div className="quiz-progress-bar-wrap">
          <div className="quiz-progress-bar-fill" style={{ width: `${(index / total) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: '20px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.04))' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-indigo)',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          Soru {index + 1}
        </p>
        <h3 style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 600 }}>
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {question.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (answered) {
            if (i === question.correctIndex) cls += ' correct'
            else if (i === selected) cls += ' wrong'
          }
          return (
            <button key={i} className={cls} disabled={answered} onClick={() => handleSelect(i)}>
              <span className="option-letter">{letters[i]}</span>
              {opt.replace(/^[A-D]\)\s*/, '')}
            </button>
          )
        })}
      </div>

      {/* Explanation + Next Button */}
      {answered && (
        <div className="animate-fade">
          <div style={{
            padding: '16px 20px', borderRadius: 'var(--radius-md)',
            background: selected === question.correctIndex
              ? 'rgba(16,217,160,0.08)' : 'rgba(244,63,94,0.08)',
            border: `1px solid ${selected === question.correctIndex
              ? 'rgba(16,217,160,0.25)' : 'rgba(244,63,94,0.25)'}`,
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px',
              color: selected === question.correctIndex ? 'var(--accent-mint)' : 'var(--accent-rose)' }}>
              {selected === question.correctIndex ? '✅ Doğru!' : '❌ Yanlış'}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {question.explanation}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => onAnswer(selected === question.correctIndex)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isLast ? '🏁 Sonuçları Gör' : 'Sonraki Soru →'}
          </button>
        </div>
      )}
    </div>
  )
}


// ── Score Screen ──────────────────────────────────────────────────
function ScoreScreen({ score, total, onRetake }) {
  const pct = Math.round((score / total) * 100)
  const color = pct >= 80 ? 'var(--accent-mint)' : pct >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)'
  const message = pct >= 80 ? '🎉 Excellent work!' : pct >= 60 ? '👍 Good effort!' : '📖 Keep studying!'

  return (
    <div className="animate-fade-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{message.split(' ')[0]}</div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{message.slice(2)}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        You scored {score} out of {total} questions correctly.
      </p>

      <div style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
        padding: '32px 48px', borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        marginBottom: '32px',
      }}>
        <div style={{ fontFamily: 'Outfit', fontSize: '5rem', fontWeight: 800, color, lineHeight: 1 }}>{pct}</div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '4px' }}>/ 100</div>
        <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {pct >= 80 ? 'Mastered' : pct >= 60 ? 'Proficient' : 'Needs Review'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onRetake}>🔄 New Quiz</button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function QuizGenerator() {
  const [phase, setPhase] = useState('setup') // setup | extracting | quiz | score
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfText, setPdfText] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [provider, setProvider] = useState('claude')
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [history, setHistory] = useState([])
  const [isDemoMode, setIsDemoMode] = useState(false)

  const CLAUDE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY
  const hasKey = provider === 'claude'
    ? (CLAUDE_KEY && CLAUDE_KEY !== 'your_claude_api_key_here')
    : (OPENAI_KEY && OPENAI_KEY !== 'your_openai_api_key_here')

  useEffect(() => { loadHistory() }, [])

  async function loadHistory() {
    const data = await getQuizSessions()
    setHistory(data)
  }

  const onDrop = useCallback(async (accepted) => {
    if (!accepted.length) return
    const file = accepted[0]
    if (file.type !== 'application/pdf') { toast.error('Please upload a PDF file'); return }
    setPdfFile(file)
    toast.success(`"${file.name}" loaded!`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false,
  })

  async function handleGenerate() {
    if (!pdfFile) { toast.error('Please upload a PDF first'); return }
    setPhase('extracting')

    try {
      let qs
      if (!hasKey) {
        await new Promise(r => setTimeout(r, 2000))
        qs = getMockQuiz(questionCount)
        setIsDemoMode(true)
        toast('Running in demo mode — add an API key for real AI questions', { icon: '⚠️' })
      } else {
        toast('Extracting PDF text...', { id: 'extract' })
        const text = await extractTextFromPDF(pdfFile)
        setPdfText(text)
        toast.loading('Generating quiz...', { id: 'extract' })

        if (provider === 'claude') {
          qs = await generateQuiz_Claude(text, questionCount, difficulty)
        } else {
          qs = await generateQuiz_OpenAI(text, questionCount, difficulty)
        }
        toast.dismiss('extract')
      }

      setQuestions(qs)
      setCurrentQ(0)
      setScore(0)

      // Save session
      await saveQuizSession({
        pdf_name: pdfFile.name,
        questions: qs,
        ai_provider: isDemoMode ? 'demo' : provider,
      })
      loadHistory()

      setPhase('quiz')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate quiz. Check your API key.')
      setPhase('setup')
    }
  }

  function handleAnswer(correct) {
    if (correct) setScore(s => s + 1)
    if (currentQ + 1 >= questions.length) {
      setPhase('score')
    } else {
      setCurrentQ(c => c + 1)
    }
  }

  function handleRetake() {
    setPhase('setup')
    setPdfFile(null)
    setQuestions([])
    setCurrentQ(0)
    setScore(0)
    setIsDemoMode(false)
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '760px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2rem' }}>📚</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>PDF Quiz Generator</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Upload any PDF and get an AI-generated multiple-choice quiz to test your knowledge.
          </p>
        </div>

        {/* Setup Phase */}
        {phase === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-up">
            {!hasKey && (
              <div className="demo-banner">
                <span>⚠️</span>
                <span>No API key detected — quiz will run in <strong>demo mode</strong> with sample questions.</span>
              </div>
            )}

            {/* AI Provider Toggle */}
            <div className="card" style={{ padding: '20px' }}>
              <p className="section-title" style={{ marginBottom: '12px' }}>AI Provider</p>
              <div className="ai-toggle">
                <button className={`ai-toggle-btn ${provider === 'claude' ? 'active' : ''}`}
                  onClick={() => setProvider('claude')}>🤖 Claude</button>
                <button className={`ai-toggle-btn ${provider === 'openai' ? 'active-openai active' : ''}`}
                  onClick={() => setProvider('openai')}>🟢 GPT-4o</button>
              </div>
            </div>

            {/* Dropzone */}
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <div className="dropzone-icon">{pdfFile ? '📄' : '☁️'}</div>
              {pdfFile ? (
                <>
                  <div className="dropzone-title" style={{ color: 'var(--accent-mint)' }}>
                    {pdfFile.name}
                  </div>
                  <div className="dropzone-sub">
                    {(pdfFile.size / 1024).toFixed(1)} KB · Click or drag to replace
                  </div>
                </>
              ) : (
                <>
                  <div className="dropzone-title">Drop your PDF here</div>
                  <div className="dropzone-sub">or click to browse · PDF files only</div>
                </>
              )}
            </div>

            {/* Settings */}
            <div className="card">
              <p className="section-title" style={{ marginBottom: '16px' }}>Quiz Settings</p>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Number of Questions</label>
                  <select className="form-select" value={questionCount} onChange={e => setQuestionCount(+e.target.value)}>
                    <option value={5}>5 questions</option>
                    <option value={10}>10 questions</option>
                    <option value={15}>15 questions</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleGenerate}
              style={{ width: '100%', justifyContent: 'center',
                background: 'var(--gradient-cyan)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
              ✨ Generate Quiz
            </button>
          </div>
        )}

        {/* Extracting Phase */}
        {phase === 'extracting' && (
          <div className="card loading-state">
            <div className="spinner" style={{ borderTopColor: 'var(--accent-cyan)' }} />
            <p>Extracting PDF content & generating questions...</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This may take 10–20 seconds</p>
          </div>
        )}

        {/* Quiz Phase */}
        {phase === 'quiz' && questions.length > 0 && (
          <QuizQuestion
            key={currentQ}
            question={questions[currentQ]}
            index={currentQ}
            total={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {/* Score Phase */}
        {phase === 'score' && (
          <div className="card">
            <ScoreScreen score={score} total={questions.length} onRetake={handleRetake} />
          </div>
        )}

        {/* History */}
        {phase === 'setup' && history.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <hr className="divider" />
            <p className="section-title">Recent Quiz Sessions</p>
            <div style={{ marginTop: '12px' }}>
              {history.map(h => (
                <div key={h.id} className="history-item">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.pdf_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(h.created_at).toLocaleDateString()} · {h.questions?.length} questions · {h.ai_provider}
                    </div>
                  </div>
                  <span className="badge badge-cyan">{h.questions?.length}Q</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

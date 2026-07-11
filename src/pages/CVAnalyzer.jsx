import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { analyzeCV_Claude } from '../lib/claude'
import { analyzeCV_OpenAI } from '../lib/openai'
import { saveAnalysis, getAnalyses } from '../lib/supabase'
import { getMockCVAnalysis } from '../lib/mockAI'
import { extractTextFromPDF } from '../lib/pdfExtract'
import { useAuth } from '../context/AuthContext'

// Extract text from Word (.docx)
async function extractFromWord(file) {
  const mammoth = (await import('mammoth')).default
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

// CV Upload Dropzone Component
function CVUploadZone({ onExtracted, onClear, fileLoaded }) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [charCount, setCharCount] = useState(0)

  const onDrop = useCallback(async (accepted) => {
    if (!accepted.length) return
    const file = accepted[0]
    const isPDF  = file.type === 'application/pdf'
    const isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || file.name.endsWith('.doc') || file.name.endsWith('.docx')

    if (!isPDF && !isWord) {
      toast.error('Sadece PDF veya Word (.docx) dosyasi yukleyin')
      return
    }

    setUploading(true)
    setUploadedFile(file)
    try {
      let text = ''
      if (isPDF)  text = await extractTextFromPDF(file)
      if (isWord) text = await extractFromWord(file)

      if (!text || text.length < 30) {
        toast.error(
          'PDF\'den metin okunamadı. CV\'nizi Word (.docx) olarak kaydedin veya aşağıya metin olarak yapıştırın.',
          { duration: 5000 }
        )
        setUploadedFile(null)
        return
      }
      setCharCount(text.length)
      onExtracted(text)
      toast.success(file.name + ' basariyla okundu!')
    } catch (err) {
      console.error(err)
      toast.error('Dosya okunamadi, lutfen tekrar deneyin.')
      setUploadedFile(null)
    } finally {
      setUploading(false)
    }
  }, [onExtracted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: false,
  })

  // File loaded success state
  if (uploadedFile && fileLoaded) {
    return (
      <div style={{
        padding: '16px 20px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(16,217,160,0.08)',
        border: '1px solid rgba(16,217,160,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.5rem' }}>📄</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-mint)' }}>{uploadedFile.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{charCount.toLocaleString()} karakter okundu — analiz icin hazir</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setCharCount(0); onClear(); }}
        >
          Degistir
        </button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      style={{
        border: isDragActive ? '2px dashed var(--accent-indigo)' : '2px dashed var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragActive ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.25s',
      }}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
          <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
          <span style={{ fontSize: '0.85rem' }}>Dosya okunuyor...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '2rem' }}>📎</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {isDragActive ? 'Birak!' : "CV'ni buraya sur veya tikla"}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PDF veya Word (.docx) desteklenir</span>
          <span className="badge badge-indigo" style={{ marginTop: '4px' }}>PDF · DOC · DOCX</span>
        </div>
      )}
    </div>
  )
}

// ── Progress Ring ────────────────────────────────────────────────
function ProgressRing({ score, size = 120, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = score >= 75 ? '#10d9a0' : score >= 50 ? '#f59e0b' : '#f43f5e'

  return (
    <div className="progress-ring-container">
      <svg className="progress-ring-svg" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
        <circle className="progress-ring-circle" cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 800, color }}>{score}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Match</div>
      </div>
    </div>
  )
}

// ── Result Dashboard ──────────────────────────────────────────────
function ResultDashboard({ result, provider }) {
  const [showCover, setShowCover] = useState(false)

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Score + Summary */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <ProgressRing score={result.matchScore} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1.3rem' }}>Analysis Complete</h2>
              <span className={`badge ${provider === 'claude' ? 'badge-indigo' : 'badge-mint'}`}>
                {provider === 'claude' ? '🤖 Claude' : '🟢 GPT-4o'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Strengths */}
        <div className="card">
          <p className="section-title" style={{ color: 'var(--accent-mint)' }}>✅ Strengths</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.strengths.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-mint)', flexShrink: 0 }}>◆</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Gaps */}
        <div className="card">
          <p className="section-title" style={{ color: 'var(--accent-rose)' }}>⚠️ Gaps</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.gaps.map((g, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-rose)', flexShrink: 0 }}>◆</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing Keywords */}
      <div className="card">
        <p className="section-title">💡 Missing Keywords</p>
        <div>
          {result.missingKeywords.map((k) => (
            <span key={k} className="chip chip-indigo">{k}</span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="card">
        <p className="section-title">📝 Suggestions</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {result.suggestions.map((s, i) => (
            <div key={i} style={{
              display: 'flex', gap: '14px', alignItems: 'flex-start',
              padding: '14px 16px', borderRadius: 'var(--radius-md)',
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)',
            }}>
              <span style={{
                minWidth: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{i + 1}</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cover Letter */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <p className="section-title" style={{ marginBottom: 0 }}>✉️ Cover Letter Opening</p>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowCover(!showCover)}>
            {showCover ? 'Hide' : 'Show'}
          </button>
        </div>
        {showCover && (
          <div style={{
            padding: '16px', borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
            fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8,
          }}>
            "{result.coverLetterOpening}"
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function CVAnalyzer() {
  const { user } = useAuth()
  const [cvText, setCvText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [provider, setProvider] = useState('claude')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [isDemoMode, setIsDemoMode] = useState(false)

  const CLAUDE_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
  const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY
  const hasKey = provider === 'claude'
    ? (CLAUDE_KEY && CLAUDE_KEY !== 'your_claude_api_key_here')
    : (OPENAI_KEY && OPENAI_KEY !== 'your_openai_api_key_here')

  useEffect(() => {
    if (user) {
      loadHistory()
    } else {
      setHistory([])
    }
  }, [user])

  async function loadHistory() {
    const data = await getAnalyses()
    setHistory(data)
  }

  async function handleAnalyze() {
    if (!cvText.trim() || !jobDesc.trim()) {
      toast.error('Please fill in both your CV and the job description')
      return
    }
    setLoading(true)
    setResult(null)
    setIsDemoMode(false)

    try {
      let analysisResult
      if (!hasKey) {
        // Demo mode
        await new Promise(r => setTimeout(r, 2000))
        analysisResult = getMockCVAnalysis(jobTitle || 'Software Engineer')
        setIsDemoMode(true)
        toast('Running in demo mode — add an API key for real AI analysis', { icon: '⚠️' })
      } else if (provider === 'claude') {
        analysisResult = await analyzeCV_Claude(cvText, jobTitle, jobDesc)
      } else {
        analysisResult = await analyzeCV_OpenAI(cvText, jobTitle, jobDesc)
      }

      setResult(analysisResult)

      // Save to Supabase
      await saveAnalysis({
        job_title: jobTitle,
        job_description: jobDesc.slice(0, 500),
        cv_text: cvText.slice(0, 500),
        analysis_result: analysisResult,
        ai_provider: isDemoMode ? 'demo' : provider,
      })
      loadHistory()
      toast.success('Analysis complete & saved!')
    } catch (err) {
      console.error('Analysis error:', err)
      const msg = err?.message || String(err)
      const isQuotaError = msg.includes('credit') || msg.includes('quota') || msg.includes('billing') || msg.includes('balance')
      const isAuthError  = msg.includes('401') || msg.includes('403')

      if (isQuotaError) {
        // Otomatik demo moduna geç
        toast('API krediniz bitti — Demo moda geçildi 🔄', { icon: '⚠️', duration: 4000 })
        const demoResult = getMockCVAnalysis(jobTitle || 'Software Engineer')
        setResult(demoResult)
        setIsDemoMode(true)
        await saveAnalysis({
          job_title: jobTitle,
          job_description: jobDesc.slice(0, 500),
          cv_text: cvText.slice(0, 500),
          analysis_result: demoResult,
          ai_provider: 'demo',
        })
        loadHistory()
      } else if (isAuthError) {
        toast.error('API key geçersiz. .env dosyasını kontrol edin.', { duration: 6000 })
      } else if (msg.includes('429')) {
        toast.error('Rate limit — biraz bekleyip tekrar deneyin.', { duration: 6000 })
      } else if (msg.includes('JSON')) {
        toast.error('AI yanıtı parse edilemedi. Tekrar deneyin.', { duration: 6000 })
      } else {
        toast.error('Hata: ' + msg.slice(0, 80), { duration: 6000 })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>CV Analyzer</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Paste your CV and a job description. Get an AI-powered match score and actionable insights.
          </p>
        </div>

        {!hasKey && (
          <div className="demo-banner">
            <span>⚠️</span>
            <span>No API key detected — analysis will run in <strong>demo mode</strong> with simulated results.</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '28px', alignItems: 'start' }}>
          {/* Input Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* AI Toggle */}
            <div className="card" style={{ padding: '20px' }}>
              <p className="section-title" style={{ marginBottom: '12px' }}>AI Provider</p>
              <div className="ai-toggle">
                <button
                  className={`ai-toggle-btn ${provider === 'claude' ? 'active' : ''}`}
                  onClick={() => setProvider('claude')}
                >
                  🤖 Claude
                </button>
                <button
                  className={`ai-toggle-btn ${provider === 'openai' ? 'active-openai active' : ''}`}
                  onClick={() => setProvider('openai')}
                >
                  🟢 GPT-4o
                </button>
              </div>
            </div>

            {/* Job Info */}
            <div className="card">
              <p className="section-title" style={{ marginBottom: '16px' }}>Job Details</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Software Engineer Intern"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Description *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Paste the full job description here..."
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    style={{ minHeight: '160px' }}
                  />
                </div>
              </div>
            </div>

            {/* CV Input */}
            <div className="card">
              <p className="section-title" style={{ marginBottom: '12px' }}>CV / Özgeçmiş *</p>
              <CVUploadZone
                onExtracted={setCvText}
                onClear={() => setCvText('')}
                fileLoaded={cvText.length > 0}
              />
              {!cvText && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ya da metin olarak yapistir</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  </div>
                  <textarea
                    className="form-textarea"
                    placeholder="CV metnini buraya yapistir (deneyim, beceriler, egitim, projeler)..."
                    value={cvText}
                    onChange={e => setCvText(e.target.value)}
                    style={{ minHeight: '160px' }}
                  />
                </>
              )}
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={handleAnalyze}
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? (
                <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Analyzing...</>
              ) : (
                <> 🔍 Analyze My CV</>
              )}
            </button>
          </div>

          {/* Results */}
          {loading && !result && (
            <div className="loading-state card" style={{ padding: '60px 40px' }}>
              <div className="spinner" />
              <p>AI is analyzing your CV...</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>This takes 5–15 seconds</p>
            </div>
          )}

          {result && <ResultDashboard result={result} provider={isDemoMode ? 'demo' : provider} />}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <hr className="divider" />
            <p className="section-title">Recent Analyses</p>
            <div style={{ marginTop: '12px' }}>
              {history.map(h => (
                <div key={h.id} className="history-item" onClick={() => setResult(h.analysis_result)}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.job_title || 'Untitled Role'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(h.created_at).toLocaleDateString()} · {h.ai_provider}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem',
                      color: h.analysis_result?.matchScore >= 75 ? 'var(--accent-mint)'
                        : h.analysis_result?.matchScore >= 50 ? 'var(--accent-amber)'
                        : 'var(--accent-rose)',
                    }}>
                      {h.analysis_result?.matchScore}%
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

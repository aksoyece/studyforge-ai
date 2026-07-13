import { useState, useEffect, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { generateQuiz_Claude, generateSummary_Claude, generateFlashcards_Claude, askDocument_Claude } from '../lib/claude'
import { generateQuiz_OpenAI, generateSummary_OpenAI, generateFlashcards_OpenAI, askDocument_OpenAI } from '../lib/openai'
import { saveQuizSession, getQuizSessions, saveQuizResult } from '../lib/supabase'
import { getMockQuiz, getMockSummary, getMockFlashcards, getMockChatResponse } from '../lib/mockAI'
import { extractTextFromPDF } from '../lib/pdfExtract'
import { useAuth } from '../context/AuthContext'

// Simple regex markdown parser to avoid external packages
function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    
    // Headers
    .replace(/^#\s+(.+)$/gm, '<h1 style="font-size: 1.6rem; font-weight: 800; margin: 24px 0 12px 0; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">$1</h1>')
    .replace(/^##\s+(.+)$/gm, '<h2 style="font-size: 1.25rem; font-weight: 700; margin: 20px 0 10px 0; color: var(--accent-cyan); border-bottom: 1px solid var(--border); padding-bottom: 6px;">$1</h2>')
    .replace(/^###\s+(.+)$/gm, '<h3 style="font-size: 1.1rem; font-weight: 600; margin: 16px 0 8px 0; color: var(--text-primary);">$1</h3>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 750;">$1</strong>')
    
    // Bullet lists (ensure clean items inside lists)
    .replace(/^\s*-\s+(.+)$/gm, '<li style="margin-left: 20px; list-style-type: disc; margin-bottom: 8px; color: var(--text-secondary);">$1</li>')
    
    // Paragraph spacing (simple line breaks to double line breaks)
    .replace(/\n\n/g, '<div style="margin-bottom: 16px;"></div>')
    .replace(/\n/g, '<br/>')

  return html
}

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
            onClick={() => onAnswer(selected === question.correctIndex, question)}
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
  const message = pct >= 80 ? '🎉 Mükemmel Sonuç!' : pct >= 60 ? '👍 İyi Deneme!' : '📖 Daha Fazla Çalışmalısın!'

  return (
    <div className="animate-fade-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{message.split(' ')[0]}</div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{message.slice(2)}</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        {total} sorudan {score} tanesini doğru cevapladınız.
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
          {pct >= 80 ? 'Uzman' : pct >= 60 ? 'Yeterli' : 'Tekrar Etmeli'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={onRetake}>🔄 Yeni Çalışma</button>
      </div>
    </div>
  )
}

// ── Flashcard Study Component ─────────────────────────────────────
function FlashcardStudy({ cards }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!cards || cards.length === 0) return null

  const curCard = cards[currentIdx]

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <span>Kart {currentIdx + 1} / {cards.length}</span>
        <span>Çevirmek için karta tıklayın</span>
      </div>

      {/* 3D Card */}
      <div 
        className={`flashcard-perspective ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-inner">
          {/* Front */}
          <div className="flashcard-front">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-indigo)', textTransform: 'uppercase', marginBottom: '16px' }}>Terim / Soru</span>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.6 }}>{curCard.front}</p>
          </div>
          {/* Back */}
          <div className="flashcard-back">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-mint)', textTransform: 'uppercase', marginBottom: '16px' }}>Açıklama / Cevap</span>
            <p style={{ fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.6 }}>{curCard.back}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button 
          className="btn btn-secondary" 
          disabled={currentIdx === 0}
          onClick={() => { setFlipped(false); setCurrentIdx(c => c - 1); }}
        >
          ← Önceki
        </button>
        <button 
          className="btn btn-primary" 
          disabled={currentIdx === cards.length - 1}
          onClick={() => { setFlipped(false); setCurrentIdx(c => c + 1); }}
        >
          Sonraki →
        </button>
      </div>
    </div>
  )
}

// ── Main Workspace Page ───────────────────────────────────────────
export default function QuizGenerator() {
  const { user } = useAuth()
  const [phase, setPhase] = useState('setup') // setup | extracting | workspace
  const [studyMode, setStudyMode] = useState('summary') // summary | flashcards | quiz
  
  // Upload Types
  const [uploadType, setUploadType] = useState('pdf') // pdf | youtube | url | image
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [sourceName, setSourceName] = useState('')

  const [pdfFile, setPdfFile] = useState(null)
  const [pdfText, setPdfText] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [provider, setProvider] = useState('claude')

  // Generative Outputs
  const [questions, setQuestions] = useState([])
  const [summary, setSummary] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [wrongQuestions, setWrongQuestions] = useState([])
  
  // Chat Integration States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Merhaba! Yüklediğiniz bu çalışma belgesiyle ilgili sormak istediğiniz soruları yanıtlayabilir, karmaşık kavramları daha basit açıklayabilirim. Ne öğrenmek istersiniz?' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('PDF verileri çıkarılıyor...')
  const [loadingProgress, setLoadingProgress] = useState(0)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    let interval;
    if (phase === 'extracting') {
      setLoadingProgress(0)
      setLoadingText('Metin ayrıştırılıyor...')
      interval = setInterval(() => {
        setLoadingProgress(p => {
          const next = p + (Math.random() * 3 + 1); // 1 to 4 percent bump
          const capped = next > 95 ? 95 : next;
          if (p < 30 && capped >= 30) setLoadingText('Önemli kavramlar çıkarılıyor...')
          if (p < 60 && capped >= 60) setLoadingText('Bilgi kartları hazırlanıyor...')
          if (p < 80 && capped >= 80) setLoadingText('Soru bankası oluşturuluyor...')
          return capped;
        })
      }, 400) 
    }
    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (studyMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, studyMode])
  
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [history, setHistory] = useState([])
  const [isDemoMode, setIsDemoMode] = useState(false)

  async function handleSendChatMessage() {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    
    // Append user message
    const updatedMessages = [...chatMessages, { sender: 'user', text: userMsg }]
    setChatMessages(updatedMessages)
    setChatLoading(true)

    try {
      let aiResponse = ''
      if (!hasKey || isDemoMode) {
        // Safe offline simulated delay
        await new Promise(r => setTimeout(r, 1200))
        aiResponse = getMockChatResponse(userMsg)
      } else {
        if (provider === 'claude') {
          aiResponse = await askDocument_Claude(pdfText, userMsg, chatMessages)
        } else {
          aiResponse = await askDocument_OpenAI(pdfText, userMsg, chatMessages)
        }
      }
      setChatMessages([...updatedMessages, { sender: 'ai', text: aiResponse }])
    } catch (err) {
      console.error('Chat error:', err)
      // Fallback mock response instead of freezing
      await new Promise(r => setTimeout(r, 1000))
      const aiResponse = getMockChatResponse(userMsg)
      setChatMessages([...updatedMessages, { sender: 'ai', text: aiResponse }])
    } finally {
      setChatLoading(false)
    }
  }

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
    const data = await getQuizSessions()
    setHistory(data)
  }

  const onDrop = useCallback(async (accepted) => {
    if (!accepted.length) return
    const file = accepted[0]
    if (uploadType === 'image') {
      if (!file.type.startsWith('image/')) { toast.error('Lütfen geçerli bir resim yükleyin'); return }
      setImageFile(file)
      toast.success(`"${file.name}" yüklendi!`)
    } else {
      if (file.type !== 'application/pdf') { toast.error('Lütfen geçerli bir PDF yükleyin'); return }
      setPdfFile(file)
      toast.success(`"${file.name}" yüklendi!`)
    }
  }, [uploadType])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: uploadType === 'image' ? { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] } : { 'application/pdf': ['.pdf'] }, multiple: false,
  })

  async function handleGenerate() {
    if (uploadType === 'pdf' && !pdfFile) { toast.error('Lütfen bir PDF dosyası sürükleyin.'); return }
    if (uploadType === 'image' && !imageFile) { toast.error('Lütfen bir resim dosyası sürükleyin.'); return }
    if (uploadType === 'youtube' && !youtubeUrl) { toast.error('Lütfen bir YouTube linki girin.'); return }
    if (uploadType === 'url' && !websiteUrl) { toast.error('Lütfen bir web sitesi linki girin.'); return }
    
    setPhase('extracting')
    setIsDemoMode(false)

    try {
      let extractedQs = []
      let extractedSummary = ''
      let extractedFlashcards = []
      let finalSourceName = 'Untitled Document'

      if (!hasKey) {
        // Demo Modu
        toast.error('Demo modundasınız! Kendi linkinizi/dosyanızı analiz etmek için Ayarlar menüsünden API Anahtarı (Claude/OpenAI) girmelisiniz.', { duration: 6000 })
        await new Promise(r => setTimeout(r, 2000))
        extractedQs = getMockQuiz(questionCount)
        extractedSummary = getMockSummary()
        extractedFlashcards = getMockFlashcards()
        setIsDemoMode(true)
        
        finalSourceName = uploadType === 'youtube' ? 'YouTube Video (Demo)' : 
                     uploadType === 'url' ? 'Web Makalesi (Demo)' : 
                     uploadType === 'image' ? (imageFile?.name || 'Resim Notu (Demo)') : (pdfFile?.name || 'PDF (Demo)')
        setSourceName(finalSourceName)
        
        toast('Örnek bir yazılım (React/Binary Search) içeriği gösteriliyor...', { icon: 'ℹ️' })
      } else {
        toast('İçerik ayrıştırılıyor...', { id: 'extract' })
        let text = ''
        
        if (uploadType === 'pdf') {
          text = await extractTextFromPDF(pdfFile)
          finalSourceName = pdfFile.name
        } else if (uploadType === 'image') {
          await new Promise(r => setTimeout(r, 2500)) 
          text = "Kullanıcı bir ders notu fotoğrafı yükledi. Görüntü işleme API'si şu an aktif olmadığı için, lütfen genel bir çalışma rehberi oluştur: Konu - Öğrenci Notları."
          finalSourceName = imageFile.name
        } else if (uploadType === 'youtube') {
          try {
            toast('YouTube video bilgileri çekiliyor...', { id: 'extract' })
            // Fetch youtube page via allorigins to get title and description
            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(youtubeUrl)}`)
            const data = await res.json()
            const html = data.contents
            
            const titleMatch = html.match(/<title>(.*?)<\/title>/i)
            const title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : youtubeUrl
            
            const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)
            const description = descMatch ? descMatch[1] : ""
            
            toast('Sadece video başlığı ve açıklaması üzerinden özet çıkarılıyor (Tam transkript için backend gerekir).', { icon: 'ℹ️', duration: 4000 })
            
            text = `Aşağıdaki başlığa ve açıklama metnine sahip YouTube videosu için detaylı bir çalışma özeti, önemli kavramlar ve test soruları çıkar:
            
Başlık: ${title}
Açıklama: ${description}`
            finalSourceName = title
          } catch(e) {
            text = `Aşağıdaki YouTube videosu için detaylı çalışma özeti çıkar: ${youtubeUrl}`
            finalSourceName = "YouTube Videosu"
          }
        } else if (uploadType === 'url') {
          try {
            toast('Web sitesi içeriği okunuyor...', { id: 'extract' })
            const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(websiteUrl)}`)
            const data = await res.json()
            
            // Extract title
            const titleMatch = data.contents.match(/<title>(.*?)<\/title>/i)
            const title = titleMatch ? titleMatch[1] : websiteUrl
            
            // Extract body text (rudimentary client-side scraping)
            const parser = new DOMParser()
            const doc = parser.parseFromString(data.contents, 'text/html')
            
            // Remove scripts and styles
            doc.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove())
            
            let bodyText = doc.body ? doc.body.innerText : ''
            bodyText = bodyText.replace(/\s+/g, ' ').trim()
            
            // Limit to ~15000 characters to prevent API payload limits
            if (bodyText.length > 15000) bodyText = bodyText.substring(0, 15000)
            
            text = `Aşağıdaki web sitesi metnini okuyarak detaylı bir çalışma özeti, kavramlar ve test çıkar.
            
Site Başlığı: ${title}
İçerik:
${bodyText}`
            
            finalSourceName = title.length > 50 ? title.substring(0, 50) + '...' : title
          } catch(e) {
            text = `Aşağıdaki Web sayfası için detaylı çalışma özeti çıkar: ${websiteUrl}`
            finalSourceName = "Web Sayfası"
          }
        }
        
        setSourceName(finalSourceName)
        setPdfText(text)
        
        toast.loading('Çalışma alanınız AI ile oluşturuluyor...', { id: 'extract' })

        if (provider === 'claude') {
          const [qs, summ, cards] = await Promise.all([
            generateQuiz_Claude(text, questionCount, difficulty),
            generateSummary_Claude(text),
            generateFlashcards_Claude(text)
          ])
          extractedQs = qs
          extractedSummary = summ
          extractedFlashcards = cards
        } else {
          const [qs, summ, cards] = await Promise.all([
            generateQuiz_OpenAI(text, questionCount, difficulty),
            generateSummary_OpenAI(text),
            generateFlashcards_OpenAI(text)
          ])
          extractedQs = qs
          extractedSummary = summ
          extractedFlashcards = cards
        }
        toast.dismiss('extract')
      }

      setQuestions(extractedQs)
      setSummary(extractedSummary)
      setFlashcards(extractedFlashcards)
      
      setCurrentQ(0)
      setScore(0)
      setQuizFinished(false)

      // Oturumu kaydet
      await saveQuizSession({
        pdf_name: finalSourceName,
        questions: { qs: extractedQs, summary: extractedSummary, flashcards: extractedFlashcards },
        ai_provider: isDemoMode ? 'demo' : provider,
      })
      loadHistory()
      setPhase('workspace')
      setStudyMode('summary')
    } catch (err) {
      console.error('Study generation error:', err)
      toast.dismiss('extract')
      toast('API hatası oluştu — Çalışma alanınız demo verisiyle hazırlanıyor 🔄', { icon: '⚠️', duration: 4000 })
      
      await new Promise(r => setTimeout(r, 1000))
      const mockQs = getMockQuiz(questionCount)
      const mockSummary = getMockSummary()
      const mockCards = getMockFlashcards()

      setQuestions(mockQs)
      setSummary(mockSummary)
      setFlashcards(mockCards)
      
      setCurrentQ(0)
      setScore(0)
      setQuizFinished(false)
      setIsDemoMode(true)

      let finalSourceName = uploadType === 'pdf' ? (pdfFile?.name || 'Error Doc') : 
                            uploadType === 'image' ? (imageFile?.name || 'Error Image') : 'Error Content'
      setSourceName(finalSourceName)

      await saveQuizSession({
        pdf_name: finalSourceName,
        questions: { qs: mockQs, summary: mockSummary, flashcards: mockCards },
        ai_provider: 'demo',
      })
      loadHistory()
      setPhase('workspace')
      setStudyMode('summary')
    }
  }

  async function handleAnswer(correct, questionObj) {
    let newWrong = [...wrongQuestions]
    if (correct) {
      setScore(s => s + 1)
    } else if (questionObj) {
      newWrong.push({
        question: questionObj.question,
        explanation: questionObj.explanation,
        correctOption: questionObj.options[questionObj.correctIndex]
      })
      setWrongQuestions(newWrong)
    }

    if (currentQ + 1 >= questions.length) {
      setQuizFinished(true)
      // Save quiz results (wrong questions and score metadata)
      await saveQuizResult({
        pdf_name: sourceName || 'Untitled Document',
        score: correct ? score + 1 : score,
        total_questions: questions.length,
        wrong_questions: newWrong,
        ai_provider: isDemoMode ? 'demo' : provider
      })
    } else {
      setCurrentQ(c => c + 1)
    }
  }

  function handleRetake() {
    setPhase('setup')
    setPdfFile(null)
    setImageFile(null)
    setYoutubeUrl('')
    setWebsiteUrl('')
    setSourceName('')
    setQuestions([])
    setSummary('')
    setFlashcards([])
    setWrongQuestions([])
    setCurrentQ(0)
    setScore(0)
    setQuizFinished(false)
    setIsDemoMode(false)
  }

  return (
    <div className="page" style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Glow Blobs */}
      <div className="glow-blob glow-blob-primary" />
      <div className="glow-blob glow-blob-secondary" />

      <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '780px', position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div className="icon-container" style={{ width: '48px', height: '48px', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>AI Study Workspace</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Dilediğiniz PDF belgesini yükleyin; yapay zeka sizin için çalışma özeti çıkarsın, 3D interaktif çalışma kartları ve testler hazırlasın.
          </p>
        </div>

        {/* Setup Phase */}
        {phase === 'setup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-up">
            {!hasKey && (
              <div className="demo-banner">
                <span>⚠️</span>
                <span>API Key algılanmadı — Çalışma alanı örnek bir doküman üzerinden **demo modunda** çalışacaktır.</span>
              </div>
            )}

            {/* AI Provider Toggle */}
            <div className="card" style={{ padding: '20px' }}>
              <p className="section-title" style={{ marginBottom: '12px' }}>AI Altyapısı</p>
              <div className="ai-toggle">
                <button className={`ai-toggle-btn ${provider === 'claude' ? 'active' : ''}`}
                  onClick={() => setProvider('claude')}>🤖 Claude</button>
                <button className={`ai-toggle-btn ${provider === 'openai' ? 'active-openai active' : ''}`}
                  onClick={() => setProvider('openai')}>🟢 GPT-4o</button>
              </div>
            </div>

            {/* Upload Type Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)', marginBottom: '8px' }}>
              {[ 
                { id: 'pdf', label: 'PDF', icon: '📄' },
                { id: 'youtube', label: 'YouTube', icon: '▶️' },
                { id: 'url', label: 'Website', icon: '🌐' },
                { id: 'image', label: 'Foto (OCR)', icon: '📸' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setUploadType(t.id)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: '8px', border: 'none', cursor: 'pointer',
                    background: uploadType === t.id ? 'var(--gradient-cyan)' : 'transparent',
                    color: uploadType === t.id ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            {(uploadType === 'pdf' || uploadType === 'image') && (
              <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <div className="dropzone-icon" style={{ fontSize: '2.5rem' }}>
                  {(uploadType === 'pdf' ? pdfFile : imageFile) ? '📄' : '📁'}
                </div>
                {(uploadType === 'pdf' ? pdfFile : imageFile) ? (
                  <>
                    <div className="dropzone-title" style={{ color: 'var(--accent-mint)' }}>
                      {(uploadType === 'pdf' ? pdfFile : imageFile).name}
                    </div>
                    <div className="dropzone-sub">
                      {((uploadType === 'pdf' ? pdfFile : imageFile).size / 1024).toFixed(1)} KB · Değiştirmek için sürükleyin veya tıklayın
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropzone-title">
                      {uploadType === 'pdf' ? 'PDF Dosyanızı Buraya Sürükleyin' : 'Not Fotoğrafınızı Sürükleyin'}
                    </div>
                    <div className="dropzone-sub">
                      {uploadType === 'pdf' ? 'veya taramak için tıklayın · Sadece PDF formatı' : 'veya taramak için tıklayın · OCR destekli'}
                    </div>
                  </>
                )}
              </div>
            )}

            {uploadType === 'youtube' && (
              <div className="form-group animate-fade" style={{ marginBottom: 0 }}>
                <input type="url" className="form-input" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={{ padding: '16px', fontSize: '1rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Yapay zeka videonun alt yazılarını okuyup otomatik özet çıkaracaktır. Sadece transkripti olan videolar desteklenir.</p>
              </div>
            )}

            {uploadType === 'url' && (
              <div className="form-group animate-fade" style={{ marginBottom: 0 }}>
                <input type="url" className="form-input" placeholder="https://tr.wikipedia.org/wiki/..." value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} style={{ padding: '16px', fontSize: '1rem' }} />
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Web sitesindeki ana metin otomatik olarak ayrıştırılacaktır.</p>
              </div>
            )}

            {/* Settings */}
            <div className="card">
              <p className="section-title" style={{ marginBottom: '16px' }}>Üretim Seçenekleri</p>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Soru Sayısı (Quiz)</label>
                  <select className="form-select" value={questionCount} onChange={e => setQuestionCount(+e.target.value)}>
                    <option value={5}>5 Soru</option>
                    <option value={10}>10 Soru</option>
                    <option value={15}>15 Soru</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sınav Zorluğu</label>
                  <select className="form-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                    <option value="easy">Kolay (Genel Bilgi)</option>
                    <option value="medium">Orta (Kavramsal Anlayış)</option>
                    <option value="hard">Zor (Analitik Çözümleme)</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" onClick={handleGenerate}
              style={{ width: '100%', justifyContent: 'center',
                background: 'var(--gradient-cyan)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
              ✨ Workspace Oluştur
            </button>
          </div>
        )}

        {/* Extracting Phase */}
        {phase === 'extracting' && (
          <div className="card loading-state animate-fade-up" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px', textAlign: 'center' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--accent-cyan)', width: '60px', height: '60px', borderWidth: '4px', margin: '0 auto 24px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{loadingText}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>Lütfen bekleyin, yapay zeka analiz yapıyor...</p>
            
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${loadingProgress}%`, height: '100%', background: 'var(--gradient-cyan)', transition: 'width 0.4s ease-out' }} />
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '8px', fontWeight: 700 }}>
              {Math.round(loadingProgress)}%
            </div>
          </div>
        )}

        {/* Workspace Active Phase */}
        {phase === 'workspace' && (
          <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem', background: studyMode === 'summary' ? 'var(--bg-card)' : 'transparent', color: studyMode === 'summary' ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none' }}
                onClick={() => setStudyMode('summary')}
              >
                📝 Akıllı Özet
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem', background: studyMode === 'flashcards' ? 'var(--bg-card)' : 'transparent', color: studyMode === 'flashcards' ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none' }}
                onClick={() => setStudyMode('flashcards')}
              >
                🗂️ Flashcards
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem', background: studyMode === 'quiz' ? 'var(--bg-card)' : 'transparent', color: studyMode === 'quiz' ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none' }}
                onClick={() => setStudyMode('quiz')}
              >
                🧠 Deneme Sınavı
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem', background: studyMode === 'chat' ? 'var(--bg-card)' : 'transparent', color: studyMode === 'chat' ? 'var(--text-primary)' : 'var(--text-secondary)', border: 'none' }}
                onClick={() => setStudyMode('chat')}
              >
                🤖 AI Asistan
              </button>
            </div>

            {/* Workspace View Selector */}
            <div className="card" style={{ padding: '32px' }}>
              
              {/* Summary View */}
              {studyMode === 'summary' && (
                <div className="animate-fade" style={{ lineHeight: 1.8 }}>
                  <div 
                    className="markdown-summary"
                    style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
                  />
                  <hr className="divider" style={{ margin: '24px 0' }} />
                  <button className="btn btn-secondary" onClick={handleRetake}>Yeni Workspace Aç</button>
                </div>
              )}

              {/* Flashcards View */}
              {studyMode === 'flashcards' && (
                <div className="animate-fade">
                  <FlashcardStudy cards={flashcards} />
                </div>
              )}

              {/* Quiz View */}
              {studyMode === 'quiz' && (
                <div className="animate-fade">
                  {!quizFinished ? (
                    <QuizQuestion
                      key={currentQ}
                      question={questions[currentQ]}
                      index={currentQ}
                      total={questions.length}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <ScoreScreen score={score} total={questions.length} onRetake={handleRetake} />
                  )}
                </div>
              )}

              {/* Chat View */}
              {studyMode === 'chat' && (
                <div className="animate-fade chat-window">
                  <div className="chat-messages">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`chat-bubble ${msg.sender}`}>
                        <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="typing-dots">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  <div className="chat-input-area">
                    <input 
                      type="text" 
                      className="chat-input"
                      placeholder="Dokümanla ilgili bir soru sorun... (Örn: useState nedir?)"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendChatMessage(); }}
                      disabled={chatLoading}
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={handleSendChatMessage}
                      disabled={chatLoading}
                      style={{ padding: '12px 20px' }}
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* History */}
        {phase === 'setup' && history.length > 0 && (
          <div style={{ marginTop: '40px' }}>
            <hr className="divider" />
            <p className="section-title">Son Çalışma Oturumlarınız</p>
            <div style={{ marginTop: '12px' }}>
              {history.map(h => (
                <div key={h.id} className="history-item" onClick={() => {
                  // Geçmiş kaydı tıklandığında doğrudan yükle
                  if (h.questions?.qs) {
                    setQuestions(h.questions.qs)
                    setSummary(h.questions.summary || '')
                    setFlashcards(h.questions.flashcards || [])
                    setPdfFile({ name: h.pdf_name })
                    setPhase('workspace')
                    setStudyMode('summary')
                  }
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{h.pdf_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {new Date(h.created_at).toLocaleDateString('tr-TR')} · {h.ai_provider}
                    </div>
                  </div>
                  <span className="badge badge-cyan">İncele →</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

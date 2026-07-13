import { useState } from 'react'

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Merhaba! Ben StudyForge Asistanı. Hangi derse çalışıyorsunuz, nasıl yardımcı olabilirim?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = () => {
    if (!input.trim() || isTyping) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "Şu an o konuyu analiz edemiyorum, ama çalışma alanınıza gidip bir PDF yükleyerek detaylı çalışabilirsiniz!"
      
      const lower = userMsg.toLowerCase()
      if (lower.includes('motivasyon') || lower.includes('yoruldum') || lower.includes('çalışmak istemiyorum')) {
        aiResponse = "Biraz mola vermek iyi olabilir! Unutmayın, her büyük başarı küçük ama düzenli adımlarla gelir. 10 dakika dinlenin ve tekrar masaya dönün. 🚀"
      } else if (lower.includes('nasıl') || lower.includes('taktik') || lower.includes('pomodoro')) {
        aiResponse = "Odaklanmakta zorlanıyorsanız Pomodoro tekniğini (25 dk çalışma, 5 dk mola) deneyin. Ayrıca 'Study Workspace' alanımıza PDF yükleyerek oradan otomatik özet okumak vakit kazandırır!"
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999 }}>
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="card animate-fade-up" style={{ 
          width: '320px', 
          height: '400px', 
          marginBottom: '16px',
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          border: '1px solid var(--accent-indigo)'
        }}>
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99, 102, 241, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '1.2rem' }}>🤖</div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>AI Asistan</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                background: m.sender === 'user' ? 'var(--gradient-indigo)' : 'var(--bg-card)',
                color: m.sender === 'user' ? '#fff' : 'var(--text-primary)',
                padding: '10px 14px',
                borderRadius: '12px',
                border: m.sender === 'ai' ? '1px solid var(--border)' : 'none',
                maxWidth: '85%',
                fontSize: '0.85rem',
                lineHeight: 1.5
              }}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-card)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Yazıyor...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Bir soru sorun..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '0.85rem' }}
            />
            <button onClick={handleSend} disabled={isTyping || !input.trim()} style={{ background: 'var(--gradient-cyan)', border: 'none', borderRadius: '8px', padding: '0 12px', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          border: 'none',
          color: '#fff',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? '💬' : '✨'}
      </button>
    </div>
  )
}

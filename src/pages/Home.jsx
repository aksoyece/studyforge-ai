import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'CV Analyzer',
    description: 'Paste your CV and a job description. Get an AI-powered match score, gap analysis, missing keywords, and actionable improvement suggestions.',
    path: '/cv',
    gradient: 'var(--gradient-primary)',
    glow: 'rgba(99,102,241,0.3)',
    badge: 'Claude / GPT-4o',
    badgeClass: 'badge-indigo',
    tags: ['Match Score', 'Gap Analysis', 'Keywords', 'Cover Letter'],
  },
  {
    icon: '📚',
    title: 'PDF Quiz Generator',
    description: 'Upload any PDF — textbook, research paper, notes. AI extracts content and generates a personalized multiple-choice quiz to test your knowledge.',
    path: '/quiz',
    gradient: 'var(--gradient-cyan)',
    glow: 'rgba(6,182,212,0.3)',
    badge: 'Claude / GPT-4o',
    badgeClass: 'badge-cyan',
    tags: ['MCQ Quiz', 'Custom Difficulty', 'Instant Feedback', 'Score Tracking'],
  },
]

const steps = [
  { icon: '📄', title: 'Upload or Paste', desc: 'Add your CV text or drop a PDF file' },
  { icon: '🤖', title: 'AI Processes', desc: 'Claude or GPT-4o analyzes the content' },
  { icon: '📊', title: 'Get Insights', desc: 'Receive detailed results saved to your history' },
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

  return (
    <div className="page" style={{ paddingTop: '64px' }}>
      {/* Hero */}
      <section style={{ padding: '80px 0 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* background glow */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container animate-fade-up">
          <div style={{ marginBottom: '20px' }}>
            <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
              ⚡ Powered by Claude & GPT-4o
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800,
            marginBottom: '24px',
            background: 'var(--gradient-hero)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            Your AI Study &<br />Career Forge
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Analyze your CV against job listings for a match score and gap analysis. 
            Or upload any PDF to generate instant AI-powered quizzes.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/cv')}>
              🎯 Analyze My CV
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/quiz')}>
              📚 Create a Quiz
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div className="grid-2">
            {features.map((f) => (
              <div
                key={f.path}
                className="card card-glow animate-fade-up"
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onClick={() => navigate(f.path)}
              >
                {/* gradient top border */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: f.gradient,
                }} />

                <div style={{ fontSize: '2.5rem', marginBottom: '16px', display: 'block',
                  animation: 'float 3s ease-in-out infinite' }}>
                  {f.icon}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{f.title}</h2>
                  <span className={`badge ${f.badgeClass}`}>{f.badge}</span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
                  {f.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {f.tags.map(t => <span key={t} className="chip">{t}</span>)}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ background: f.gradient, boxShadow: `0 4px 20px ${f.glow}` }}
                >
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '40px 0 60px', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <p className="section-title" style={{ textAlign: 'center' }}>How It Works</p>
          <div className="grid-3" style={{ marginTop: '32px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.75rem', margin: '0 auto 16px',
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-indigo)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Step {i + 1}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '40px 0 80px', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-title">Built With</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
            {techStack.map(t => (
              <span key={t.name} className="chip" style={{ color: t.color, borderColor: t.color + '40', background: t.color + '12' }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

# ⚡ StudyForge AI

> AI-powered CV analyzer and PDF quiz generator built with React, Supabase, Claude & GPT-4o.

**Live Demo:** [Deploy edilecek link]

---

## 🚀 Features

### 🎯 CV Analyzer
- Upload your CV as **PDF or Word (.docx)**
- Paste any job description
- Get an AI-powered **match score (0–100)**
- See **strengths**, **gaps**, **missing keywords**
- Receive **actionable suggestions** + cover letter opening
- History saved to **Supabase**

### 📚 PDF Quiz Generator
- Drag & drop any **PDF**
- Choose question count (5 / 10 / 15) and difficulty
- AI generates **multiple-choice questions** from your content
- Instant feedback with explanations
- Manual "Next Question" flow — read at your own pace
- Quiz history saved to **Supabase**

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Vanilla CSS (dark glassmorphism) |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude + OpenAI GPT-4o |
| PDF Parsing | pdfjs-dist |
| Word Parsing | mammoth |
| File Upload | react-dropzone |

---

## ⚙️ Setup

### 1. Clone & install
```bash
git clone https://github.com/kullanici-adi/studyforge-ai.git
cd studyforge-ai
npm install
```

### 2. Environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ANTHROPIC_API_KEY=your_claude_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 3. Supabase — create tables
Run this SQL in your Supabase SQL Editor:

```sql
create table cv_analyses (
  id uuid default gen_random_uuid() primary key,
  job_title text, job_description text, cv_text text,
  analysis_result jsonb, ai_provider text,
  created_at timestamptz default now()
);

create table quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  pdf_name text, questions jsonb, ai_provider text,
  created_at timestamptz default now()
);

create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references quiz_sessions,
  score integer, total integer, answers jsonb,
  completed_at timestamptz default now()
);

alter table cv_analyses disable row level security;
alter table quiz_sessions disable row level security;
alter table quiz_results disable row level security;
```

### 4. Run
```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── CVAnalyzer.jsx    # CV analysis tool
│   └── QuizGenerator.jsx # PDF quiz tool
├── lib/
│   ├── supabase.js       # DB client & helpers
│   ├── claude.js         # Anthropic API wrapper
│   ├── openai.js         # OpenAI API wrapper
│   ├── pdfExtract.js     # PDF text extraction
│   └── mockAI.js         # Demo mode responses
└── index.css             # Design system
```

---

## 🔑 API Keys

| Service | Get key | Free tier |
|---|---|---|
| Anthropic (Claude) | [console.anthropic.com](https://console.anthropic.com) | $5 credit |
| OpenAI (GPT-4o) | [platform.openai.com](https://platform.openai.com) | $5 credit |
| Supabase | [supabase.com](https://supabase.com) | Free forever |

> **Demo mode:** Leave API keys empty — the app runs with simulated AI responses.

---

## 📄 License

MIT

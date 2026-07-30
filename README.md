# ⚡ StudyForge AI

> AI-powered CV analyzer and PDF quiz generator built with React, Supabase, Claude & GPT-4o.

**Live Demo:** https://studyforge-ai-beryl.vercel.app

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
```

### 3. Edge Function (AI Proxy) Setup
This project uses a Supabase Edge Function to securely handle AI requests and hide API keys from the client.

1. Install Supabase CLI and login.
2. Link your project: `supabase link --project-ref your_project_ref`
3. Set your AI API keys as Supabase Secrets:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxx
supabase secrets set OPENAI_API_KEY=sk-xxx
```
4. Deploy the function:
```bash
supabase functions deploy ai-proxy
```

### 3. Supabase — create tables
To set up your database schema and Row Level Security (RLS) policies, run the SQL files located in `supabase/migrations/` directly in your Supabase SQL Editor. 

Start with `001_initial_schema.sql` and proceed in numerical order.

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

## ⚠️ Known Limitations & Architectural Decisions

- **AI Rate Limits (429):** The application relies on the Google Gemini Free Tier, which imposes strict rate limits (e.g., Requests Per Minute/Day). To mitigate this, the client-side proxy (`aiProxy.js`) implements an **exponential retry-with-backoff** strategy. If the quota is completely exhausted, the UI gracefully catches the error and informs the user to wait, rather than crashing.
- **Large PDF Handling:** Instead of truncating large documents (which discards the end of the book/paper) or building a costly full RAG pipeline, the Edge Function uses **Chunk Sampling**. It extracts equal-sized chunks from the beginning, middle, and end of the document to provide the AI with a representative context without exceeding token limits.

---

## 📄 License

MIT

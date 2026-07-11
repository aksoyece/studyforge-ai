// Claude (Anthropic) API wrapper
// Uses fetch directly since we're in Vite (no Node.js SDK)

const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

async function callClaude(systemPrompt, userMessage) {
  if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'your_claude_api_key_here') {
    throw new Error('NO_KEY')
  }
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    console.error('Claude error body:', errBody)
    throw new Error(`Claude API error: ${response.status} — ${errBody?.error?.message || JSON.stringify(errBody)}`)
  }
  const data = await response.json()
  return data.content[0].text
}

export async function analyzeCV_Claude(cvText, jobTitle, jobDescription) {
  const system = `You are an expert career coach and ATS specialist. Analyze the CV against the job description and return a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "coverLetterOpening": "<A compelling 2-3 sentence cover letter opening paragraph>"
}
Return ONLY the JSON, no markdown, no explanation.`

  const message = `Job Title: ${jobTitle}\n\nJob Description:\n${jobDescription}\n\nCV/Resume:\n${cvText}`
  const raw = await callClaude(system, message)
  return JSON.parse(raw)
}

export async function generateQuiz_Claude(pdfText, questionCount, difficulty) {
  const system = `You are an expert educator. Create a multiple-choice quiz from the provided text. Return a JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "<question text>",
    "options": ["A) <option>", "B) <option>", "C) <option>", "D) <option>"],
    "correctIndex": <0-3>,
    "explanation": "<why this is correct>"
  }
]
Difficulty: ${difficulty}. Make questions ${difficulty === 'easy' ? 'straightforward and factual' : difficulty === 'medium' ? 'requiring understanding of concepts' : 'analytical and requiring deep comprehension'}.
Return ONLY the JSON array, no markdown.`

  const message = `Create exactly ${questionCount} questions from this text:\n\n${pdfText.slice(0, 6000)}`
  const raw = await callClaude(system, message)
  return JSON.parse(raw)
}

export async function generateSummary_Claude(pdfText) {
  const system = `You are an expert academic assistant. Generate a beautifully structured Markdown summary of the provided text.
Include:
- '# [Topic Title]'
- '## Genel Bakış (Overview)' (A paragraph)
- '## Önemli Başlıklar (Key Concepts)' (Bullet points with bold terms and definitions)
- '## Özet Çıkarımlar (Key Takeaways)' (3 bullet points of final conclusions)
Do not include any extra introductory or concluding conversational text. Write in Turkish if possible.`

  const message = `Summarize this text:\n\n${pdfText.slice(0, 8000)}`
  return await callClaude(system, message)
}

export async function generateFlashcards_Claude(pdfText, cardCount = 8) {
  const system = `You are an expert educator. Create exactly ${cardCount} study flashcards from the provided text.
Return a JSON array with this exact structure:
[
  {
    "front": "<Key term, question, or concept>",
    "back": "<Definition, answer, or detailed explanation>"
  }
]
Write in Turkish. Return ONLY the raw JSON array, no markdown wrap, no conversational text.`

  const message = `Create ${cardCount} flashcards from this text:\n\n${pdfText.slice(0, 8000)}`
  const raw = await callClaude(system, message)
  return JSON.parse(raw)
}

export async function analyzeWeaknesses_Claude(wrongQuestions) {
  const system = `You are an AI Study Coach. Analyze the list of questions the student got wrong and output a JSON array of the top 3-4 weak topics.
Structure:
[
  {
    "topic": "<Konu Başlığı, örn: React Hooks veya Veritabanı Normalizasyonu>",
    "percentage": <Hata oranı tahmini, örn: 80 veya 60>,
    "recommendation": "<Konuyu geliştirmek için 1 cümlelik tavsiye>"
  }
]
Write in Turkish. Return ONLY raw JSON array, no markdown.`

  const message = `Here are the questions the user failed:\n\n${JSON.stringify(wrongQuestions)}`
  const raw = await callClaude(system, message)
  return JSON.parse(raw)
}

export async function generateRecoveryQuiz_Claude(weakTopics) {
  const system = `You are an expert educator. Create a custom 5-question recovery multiple-choice quiz targeting these weak topics: ${JSON.stringify(weakTopics)}.
Return a JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "<question text>",
    "options": ["A) <option>", "B) <option>", "C) <option>", "D) <option>"],
    "correctIndex": <0-3>,
    "explanation": "<why this is correct, focusing on teaching the concept>"
  }
]
Write in Turkish. Return ONLY the JSON array, no markdown.`

  const message = `Generate 5 high-quality recovery questions.`
  const raw = await callClaude(system, message)
  return JSON.parse(raw)
}

// OpenAI API wrapper

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_MODEL = 'gpt-4o-mini'

async function callOpenAI(systemPrompt, userMessage) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    throw new Error('NO_KEY')
  }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })
  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`)
  const data = await response.json()
  return data.choices[0].message.content
}

export async function analyzeCV_OpenAI(cvText, jobTitle, jobDescription) {
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
  const raw = await callOpenAI(system, message)
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned)
}

export async function generateQuiz_OpenAI(pdfText, questionCount, difficulty) {
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
Difficulty: ${difficulty}. Return ONLY the JSON array, no markdown.`

  const message = `Create exactly ${questionCount} questions from this text:\n\n${pdfText.slice(0, 6000)}`
  const raw = await callOpenAI(system, message)
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned)
}

export async function generateSummary_OpenAI(pdfText) {
  const system = `You are an expert academic assistant. Generate a beautifully structured Markdown summary of the provided text.
Include:
- '# [Topic Title]'
- '## Genel Bakış (Overview)' (A paragraph)
- '## Önemli Başlıklar (Key Concepts)' (Bullet points with bold terms and definitions)
- '## Özet Çıkarımlar (Key Takeaways)' (3 bullet points of final conclusions)
Do not include any extra introductory or concluding conversational text. Write in Turkish if possible.`

  const message = `Summarize this text:\n\n${pdfText.slice(0, 8000)}`
  return await callOpenAI(system, message)
}

export async function generateFlashcards_OpenAI(pdfText, cardCount = 8) {
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
  const raw = await callOpenAI(system, message)
  const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned)
}

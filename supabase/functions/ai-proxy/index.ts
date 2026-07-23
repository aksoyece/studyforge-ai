const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")
const CLAUDE_MODEL = "claude-3-5-sonnet-20241022"
const OPENAI_MODEL = "gpt-4o-mini"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

function stripFences(raw: string) {
  return raw.replace(/```json\n?|\n?```/g, "").trim()
}

async function callClaude(system: string, message: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: message }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Claude error: ${res.status} — ${err?.error?.message || JSON.stringify(err)}`)
  }
  const data = await res.json()
  return stripFences(data.content[0].text)
}

async function callOpenAI(system: string, message: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`)
  const data = await res.json()
  return stripFences(data.choices[0].message.content)
}

// --- Ortak prompt builder'lar (iki dosyadaki aynı promptlar, TEK yerde) ---
const prompts: Record<string, (p: any) => { system: string; message: string }> = {
  analyzeCV: ({ cvText, jobTitle, jobDescription }) => ({
    system: `You are an expert career coach and ATS specialist. Analyze the CV against the job description and return a JSON object with this exact structure:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "missingKeywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "coverLetterOpening": "<A compelling 2-3 sentence cover letter opening paragraph>"
}
Return ONLY the JSON, no markdown, no explanation.`,
    message: `Job Title: ${jobTitle}\n\nJob Description:\n${jobDescription}\n\nCV/Resume:\n${cvText}`,
  }),

  generateQuiz: ({ pdfText, questionCount, difficulty }) => ({
    system: `You are an expert educator. Create a multiple-choice quiz from the provided text. Return a JSON array with this exact structure:
[
  { "id": 1, "question": "<question text>", "options": ["A) <option>", "B) <option>", "C) <option>", "D) <option>"], "correctIndex": <0-3>, "explanation": "<why this is correct>" }
]
Difficulty: ${difficulty}. Make questions ${difficulty === "easy" ? "straightforward and factual" : difficulty === "medium" ? "requiring understanding of concepts" : "analytical and requiring deep comprehension"}.
Return ONLY the JSON array, no markdown.`,
    message: `Create exactly ${questionCount} questions from this text:\n\n${pdfText.slice(0, 6000)}`,
  }),

  generateSummary: ({ pdfText }) => ({
    system: `You are an expert academic assistant. Generate a beautifully structured Markdown summary of the provided text.
Include:
- '# [Topic Title]'
- '## Genel Bakış (Overview)' (A paragraph)
- '## Önemli Başlıklar (Key Concepts)' (Bullet points with bold terms and definitions)
- '## Özet Çıkarımlar (Key Takeaways)' (3 bullet points of final conclusions)
Do not include any extra introductory or concluding conversational text. Write in Turkish if possible.`,
    message: `Summarize this text:\n\n${pdfText.slice(0, 8000)}`,
  }),

  generateFlashcards: ({ pdfText, cardCount = 8 }) => ({
    system: `You are an expert educator. Create exactly ${cardCount} study flashcards from the provided text.
Return a JSON array with this exact structure:
[ { "front": "<Key term, question, or concept>", "back": "<Definition, answer, or detailed explanation>" } ]
Write in Turkish. Return ONLY the raw JSON array, no markdown wrap, no conversational text.`,
    message: `Create ${cardCount} flashcards from this text:\n\n${pdfText.slice(0, 8000)}`,
  }),

  analyzeWeaknesses: ({ wrongQuestions }) => ({
    system: `You are an AI Study Coach. Analyze the list of questions the student got wrong and output a JSON array of the top 3-4 weak topics.
Structure:
[ { "topic": "<Konu Başlığı>", "percentage": <Hata oranı tahmini>, "recommendation": "<1 cümlelik tavsiye>" } ]
Write in Turkish. Return ONLY raw JSON array, no markdown.`,
    message: `Here are the questions the user failed:\n\n${JSON.stringify(wrongQuestions)}`,
  }),

  generateRecoveryQuiz: ({ weakTopics }) => ({
    system: `You are an expert educator. Create a custom 5-question recovery multiple-choice quiz targeting these weak topics: ${JSON.stringify(weakTopics)}.
Return a JSON array with this exact structure:
[ { "id": 1, "question": "<question text>", "options": ["A) <option>", "B) <option>", "C) <option>", "D) <option>"], "correctIndex": <0-3>, "explanation": "<why this is correct, focusing on teaching the concept>" } ]
Write in Turkish. Return ONLY the JSON array, no markdown.`,
    message: `Generate 5 high-quality recovery questions.`,
  }),

  askDocument: ({ pdfText, userQuestion, chatHistory = [] }) => {
    const formattedHistory = chatHistory
      .map((msg: any) => `${msg.sender === "user" ? "Student" : "AI Assistant"}: ${msg.text}`)
      .join("\n")
    return {
      system: `You are an expert AI Study Assistant. Answer the student's question based strictly on the provided document text.
Document Text:
${pdfText.slice(0, 8000)}

Rules:
- Be concise, educational, and helpful.
- If the answer cannot be found in the document, use your general knowledge but mention that it is not explicitly stated in the document.
- Write in Turkish.`,
      message: `Chat History:\n${formattedHistory}\n\nStudent Question: ${userQuestion}`,
    }
  },
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  try {
    const { action, provider = "claude", payload } = await req.json()
    const builder = prompts[action]
    if (!builder) throw new Error(`Unknown action: ${action}`)
    const { system, message } = builder(payload)
    const raw = provider === "openai" ? await callOpenAI(system, message) : await callClaude(system, message)
    return new Response(JSON.stringify({ result: raw }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

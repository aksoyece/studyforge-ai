import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY || process.argv[2];
const GEMINI_MODEL = "gemini-1.5-flash";

async function testGemini() {
  const system = "You are a helpful assistant.";
  const message = "Say hello";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testGemini().catch(console.error);

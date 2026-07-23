import { invokeAI } from './aiProxy'

export const analyzeCV_OpenAI = (cvText, jobTitle, jobDescription) =>
  invokeAI('openai', 'analyzeCV', { cvText, jobTitle, jobDescription }).then(JSON.parse)

export const generateQuiz_OpenAI = (pdfText, questionCount, difficulty) =>
  invokeAI('openai', 'generateQuiz', { pdfText, questionCount, difficulty }).then(JSON.parse)

export const generateSummary_OpenAI = (pdfText) =>
  invokeAI('openai', 'generateSummary', { pdfText })

export const generateFlashcards_OpenAI = (pdfText, cardCount = 8) =>
  invokeAI('openai', 'generateFlashcards', { pdfText, cardCount }).then(JSON.parse)

export const analyzeWeaknesses_OpenAI = (wrongQuestions) =>
  invokeAI('openai', 'analyzeWeaknesses', { wrongQuestions }).then(JSON.parse)

export const generateRecoveryQuiz_OpenAI = (weakTopics) =>
  invokeAI('openai', 'generateRecoveryQuiz', { weakTopics }).then(JSON.parse)

export const askDocument_OpenAI = (pdfText, userQuestion, chatHistory = []) =>
  invokeAI('openai', 'askDocument', { pdfText, userQuestion, chatHistory })

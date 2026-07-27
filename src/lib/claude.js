import { invokeAI } from './aiProxy'

export const analyzeCV_Claude = (cvText, jobTitle, jobDescription) =>
  invokeAI('gemini', 'analyzeCV', { cvText, jobTitle, jobDescription }).then(JSON.parse)

export const generateQuiz_Claude = (pdfText, questionCount, difficulty) =>
  invokeAI('gemini', 'generateQuiz', { pdfText, questionCount, difficulty }).then(JSON.parse)

export const generateSummary_Claude = (pdfText) =>
  invokeAI('gemini', 'generateSummary', { pdfText })

export const generateFlashcards_Claude = (pdfText, cardCount = 8) =>
  invokeAI('gemini', 'generateFlashcards', { pdfText, cardCount }).then(JSON.parse)

export const analyzeWeaknesses_Claude = (wrongQuestions) =>
  invokeAI('gemini', 'analyzeWeaknesses', { wrongQuestions }).then(JSON.parse)

export const generateRecoveryQuiz_Claude = (weakTopics) =>
  invokeAI('gemini', 'generateRecoveryQuiz', { weakTopics }).then(JSON.parse)

export const askDocument_Claude = (pdfText, userQuestion, chatHistory = []) =>
  invokeAI('gemini', 'askDocument', { pdfText, userQuestion, chatHistory })

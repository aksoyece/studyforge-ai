import { invokeAI } from './aiProxy'

export const analyzeCV_Claude = (cvText, jobTitle, jobDescription) =>
  invokeAI('claude', 'analyzeCV', { cvText, jobTitle, jobDescription }).then(JSON.parse)

export const generateQuiz_Claude = (pdfText, questionCount, difficulty) =>
  invokeAI('claude', 'generateQuiz', { pdfText, questionCount, difficulty }).then(JSON.parse)

export const generateSummary_Claude = (pdfText) =>
  invokeAI('claude', 'generateSummary', { pdfText })

export const generateFlashcards_Claude = (pdfText, cardCount = 8) =>
  invokeAI('claude', 'generateFlashcards', { pdfText, cardCount }).then(JSON.parse)

export const analyzeWeaknesses_Claude = (wrongQuestions) =>
  invokeAI('claude', 'analyzeWeaknesses', { wrongQuestions }).then(JSON.parse)

export const generateRecoveryQuiz_Claude = (weakTopics) =>
  invokeAI('claude', 'generateRecoveryQuiz', { weakTopics }).then(JSON.parse)

export const askDocument_Claude = (pdfText, userQuestion, chatHistory = []) =>
  invokeAI('claude', 'askDocument', { pdfText, userQuestion, chatHistory })

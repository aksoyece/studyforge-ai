// Vite-compatible PDF text extractor
// Worker served from /public folder — guaranteed to work in dev & production

import * as pdfjsLib from 'pdfjs-dist'

// Use local worker from /public — no CDN needed, no version mismatch
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  const pageTexts = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Sort items by vertical position (top to bottom), then left to right
    // This handles multi-column CVs correctly
    const sorted = content.items
      .filter(item => item.str.trim())
      .sort((a, b) => {
        const yDiff = Math.round(b.transform[5]) - Math.round(a.transform[5])
        if (Math.abs(yDiff) > 5) return yDiff
        return a.transform[4] - b.transform[4]
      })

    const pageText = sorted.map(item => item.str).join(' ')
    pageTexts.push(pageText)
  }

  return pageTexts.join('\n').trim()
}

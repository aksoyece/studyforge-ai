import { supabase } from './supabase'

export async function invokeAI(provider, action, payload, maxRetries = 3) {
  let attempt = 0;

  while (attempt < maxRetries) {
    const { data, error } = await supabase.functions.invoke('ai-proxy', {
      body: { action, provider, payload },
    })

    if (error) {
      let detail = error.message
      try {
        const body = await error.context.json()
        detail = body.error || detail
      } catch (_) {}

      // Rate limit (429) durumuysa ve deneme hakkımız varsa bekle ve tekrar dene
      if (detail.includes('429') && attempt < maxRetries - 1) {
        attempt++
        const waitTime = Math.pow(2, attempt) * 1000 // 2s, 4s bekler
        console.warn(`⏳ Sunucu yoğun (429). Deneme ${attempt}: ${waitTime}ms bekleniyor...`)
        await new Promise(r => setTimeout(r, waitTime))
        continue
      }

      console.error('ai-proxy error:', detail)

      // Retries tükendiyse kibar bir hata dön
      if (detail.includes('429')) {
        throw new Error("Yapay zeka sunucuları şu an çok yoğun. Lütfen 30 saniye bekleyip tekrar deneyin.")
      }
      
      throw new Error(detail)
    }

    return data.result
  }
}
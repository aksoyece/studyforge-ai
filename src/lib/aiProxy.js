import { supabase } from './supabase'

export async function invokeAI(provider, action, payload) {
  const { data, error } = await supabase.functions.invoke('ai-proxy', {
    body: { action, provider, payload },
  })

  if (error) {
    // Gerçek hata mesajını response body'sinden çek
    let detail = error.message
    try {
      const body = await error.context.json()
      detail = body.error || detail
    } catch (_) {
      // body okunamazsa fallback mesajla devam
    }
    console.error('ai-proxy error:', detail)
    throw new Error(detail)
  }

  return data.result
}
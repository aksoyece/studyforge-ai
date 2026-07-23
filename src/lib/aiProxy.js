import { supabase } from './supabase'

export async function invokeAI(provider, action, payload) {
  const { data, error } = await supabase.functions.invoke('ai-proxy', {
    body: { action, provider, payload },
  })
  if (error) throw error
  return data.result
}

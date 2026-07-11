import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// CV Analyses
export async function saveAnalysis(data) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: result, error } = await supabase
    .from('cv_analyses')
    .insert([{ ...data, user_id: session.user.id }])
    .select()
  if (error) console.error('Supabase error:', error)
  return result
}

export async function getAnalyses() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []

  const { data, error } = await supabase
    .from('cv_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) console.error('Supabase error:', error)
  return data || []
}

// Quiz Sessions
export async function saveQuizSession(data) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: result, error } = await supabase
    .from('quiz_sessions')
    .insert([{ ...data, user_id: session.user.id }])
    .select()
  if (error) console.error('Supabase error:', error)
  return result
}

export async function getQuizSessions() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []

  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) console.error('Supabase error:', error)
  return data || []
}

export async function saveQuizResult(data) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: result, error } = await supabase
    .from('quiz_results')
    .insert([{ ...data, user_id: session.user.id }])
    .select()
  if (error) console.error('Supabase error:', error)
  return result
}

export async function getQuizResults() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []

  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error('Supabase error:', error)
  return data || []
}

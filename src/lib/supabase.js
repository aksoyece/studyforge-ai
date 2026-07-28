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
    .order('completed_at', { ascending: false })
  if (error) console.error('Supabase error:', error)
  return data || []
}

// --- GROUP FEATURES ---

export async function createGroup(name) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { error: 'Not logged in' }

  // Create group
  const { data: group, error } = await supabase
    .from('groups')
    .insert([{ name, created_by: session.user.id }])
    .select()
    .single()
    
  if (error) return { error }

  // Add creator as member
  await supabase.from('group_members').insert([{ group_id: group.id, user_id: session.user.id }])
  
  return { group }
}

export async function getMyGroups() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return []

  const { data, error } = await supabase
    .from('groups')
    .select('*, group_members!inner(user_id)')
    .eq('group_members.user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching groups:', error)
    return []
  }
  return data
}

export async function joinGroup(inviteCode) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { error: 'Not logged in' }

  // Find group by invite code
  const { data: group, error: fetchErr } = await supabase
    .from('groups')
    .select('id')
    .eq('invite_code', inviteCode)
    .single()

  if (fetchErr || !group) return { error: 'Geçersiz veya süresi dolmuş davet kodu.' }

  // Join
  const { error } = await supabase
    .from('group_members')
    .insert([{ group_id: group.id, user_id: session.user.id }])

  if (error) {
    if (error.code === '23505') return { error: 'Zaten bu grubun üyesisiniz.' }
    return { error: error.message }
  }

  return { success: true, groupId: group.id }
}

export async function shareContent(groupId, contentType, contentId, title) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { error: 'Not logged in' }

  const { data, error } = await supabase
    .from('shared_content')
    .insert([{ 
      group_id: groupId, 
      shared_by: session.user.id, 
      content_type: contentType, 
      content_id: contentId,
      title
    }])
    .select()

  return { data, error }
}


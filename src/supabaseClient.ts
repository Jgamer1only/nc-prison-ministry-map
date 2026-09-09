import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

export async function getPrisonLocations() {
  const { data, error } = await supabase
    .from('prisons')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching prison locations:', error)
    return []
  }

  return data || []
}

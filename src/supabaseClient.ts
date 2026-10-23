import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Do not let a missing deployment environment variable prevent the map shell
// from loading. The map can still render, and this warning identifies why its
// dynamic prison records are not yet available.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured; prison records will not load.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function getPrisonLocations() {
  if (!supabase) return []

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

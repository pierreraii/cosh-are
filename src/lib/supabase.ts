import { createClient } from '@supabase/supabase-js'

const supabaseUrl = `https://${import.meta.env.VITE_PROJECT_ID}.supabase.co`
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
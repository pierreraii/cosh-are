import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = `https://${import.meta.env.VITE_PROJECT_ID}.supabase.co`
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mjaegejcflpwjubuoqtv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4ULSWbPqDf6WqrB8jfnDYA_zx1A5H_1'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Memory {
  id?: string
  title: string
  description?: string
  category: string
  date: string
  location?: string
  story?: string
  notes?: string
  tags?: string[]
  mood?: string
  source?: string
  highlights?: string
  image_url?: string
  video_url?: string
  likes?: number
  user_id?: string
  group_id?: string
  created_at?: string
  updated_at?: string
}

export interface Group {
  id?: string
  name: string
  description?: string
  image_url?: string
  is_public: boolean
  category?: string
  members_count?: number
  memories_count?: number
  created_at?: string
  updated_at?: string
}

export interface User {
  id?: string
  email?: string
  name?: string
  avatar_url?: string
  created_at?: string
}

export interface GroupMember {
  id?: string
  group_id: string
  user_id: string
  role: 'owner' | 'editor' | 'viewer'
  created_at?: string
}

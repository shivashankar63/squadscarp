import { supabase } from './supabase'
import type { Memory, Group, GroupMember } from './supabase'

// ==================== MEMORIES ====================

export async function getMemories(groupId?: string) {
  try {
    let query = supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false })

    if (groupId) {
      query = query.eq('group_id', groupId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error fetching memories:', error)
      // Return empty array instead of null to prevent crashes
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (error: any) {
    console.error('Error fetching memories:', error)
    // Return empty array to allow pages to load with fallback data
    return { data: [], error }
  }
}

export async function getMemoryById(id: string) {
  try {
    // Use a simpler query that avoids RLS recursion issues
    // Select only from memories table without joins that might trigger group_members checks
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      // If it's a recursion error, log it but don't spam the console
      if (error.code === '42P17') {
        console.warn('RLS policy recursion detected. Please run fix-rls-policies.sql in Supabase SQL Editor.')
        // Return null data but don't keep retrying
        return { data: null, error: { ...error, message: 'Database policy error. Please check RLS policies.' } }
      }
      console.error('Supabase error fetching memory by ID:', error)
      return { data: null, error }
    }
    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching memory:', error)
    return { data: null, error }
  }
}

export async function createMemory(memory: Memory) {
  try {
    const { data, error } = await supabase
      .from('memories')
      .insert([memory])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error creating memory:', error)
    return { data: null, error }
  }
}

export async function updateMemory(id: string, updates: Partial<Memory>) {
  try {
    const { data, error } = await supabase
      .from('memories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error updating memory:', error)
    return { data: null, error }
  }
}

export async function deleteMemory(id: string) {
  try {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { data: null, error: null }
  } catch (error: any) {
    console.error('Error deleting memory:', error)
    return { data: null, error }
  }
}

export async function likeMemory(id: string) {
  try {
    const { data: memory, error: fetchError } = await supabase
      .from('memories')
      .select('likes')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    const newLikes = (memory?.likes || 0) + 1

    const { data, error } = await supabase
      .from('memories')
      .update({ likes: newLikes })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error liking memory:', error)
    return { data: null, error }
  }
}

// ==================== GROUPS ====================

export async function getGroups(isPublic?: boolean) {
  try {
    let query = supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })

    if (isPublic !== undefined) {
      query = query.eq('is_public', isPublic)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error fetching groups:', error)
      // Return empty array instead of null to prevent crashes
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (error: any) {
    console.error('Error fetching groups:', error)
    // Return empty array to allow pages to load with fallback data
    return { data: [], error }
  }
}

export async function getGroupById(id: string) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching group:', error)
    return { data: null, error }
  }
}

export async function searchGroups(searchQuery: string) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .ilike('name', `%${searchQuery}%`)
      .eq('is_public', true)

    if (error) {
      console.error('Supabase error searching groups:', error)
      return { data: [], error }
    }
    return { data: data || [], error: null }
  } catch (error: any) {
    console.error('Error searching groups:', error)
    return { data: [], error }
  }
}

export async function createGroup(group: Group) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert([group])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error creating group:', error)
    return { data: null, error }
  }
}

export async function updateGroup(id: string, updates: Partial<Group>) {
  try {
    const { data, error } = await supabase
      .from('groups')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error updating group:', error)
    return { data: null, error }
  }
}

// ==================== FILE UPLOADS ====================

export async function uploadFile(
  file: File,
  folder: string = 'memories',
  fileName?: string
): Promise<{ url: string | null; error: any }> {
  try {
    const fileExt = file.name.split('.').pop()
    const filePath = `${folder}/${fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`}`

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return { url: urlData.publicUrl, error: null }
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return { url: null, error }
  }
}

export async function uploadMultipleFiles(
  files: File[],
  folder: string = 'memories'
): Promise<{ urls: string[]; errors: any[] }> {
  const uploadPromises = files.map((file) => uploadFile(file, folder))
  const results = await Promise.all(uploadPromises)

  const urls = results.map((r) => r.url).filter((url): url is string => url !== null)
  const errors = results.map((r) => r.error).filter((error) => error !== null)

  return { urls, errors }
}

export async function deleteFile(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return { error }
  }
}

// ==================== USERS ====================

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) throw error
    return { user, error: null }
  } catch (error: any) {
    console.error('Error getting current user:', error)
    return { user: null, error }
  }
}

export async function signUp(email: string, password: string, name?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error signing up:', error)
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error signing in:', error)
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { data: null, error: null }
  } catch (error: any) {
    console.error('Error signing out:', error)
    return { data: null, error }
  }
}

// ==================== GROUP MEMBERS ====================

export async function getGroupMembers(groupId: string) {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select('*, user:users(*)')
      .eq('group_id', groupId)

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching group members:', error)
    return { data: null, error }
  }
}

export async function addGroupMember(member: GroupMember) {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .insert([member])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error('Error adding group member:', error)
    return { data: null, error }
  }
}

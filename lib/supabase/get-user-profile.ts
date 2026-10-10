import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'

async function userProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('user_profile')
    .select('id, name, image_url, created_at')
    .eq('id', user.id)
    .single()

  return profile
}

export const getUserProfile = cache(userProfile)

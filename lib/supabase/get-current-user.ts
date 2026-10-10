import { cache } from 'react'

import { createClient } from '@/lib/supabase/server'

async function currentUser() {
  const supabase = await createClient()
  return await supabase.auth.getUser().then(({ data }) => data.user)
}

export const getCurrentUser = cache(currentUser)

'use server'

import { revalidatePath } from 'next/cache'

import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'

export type UpdateDisplayNameState = {
  error: boolean
  message: string
}

export async function updateDisplayName(
  _prevState: UpdateDisplayNameState,
  formData: FormData,
): Promise<UpdateDisplayNameState> {
  const user = await getCurrentUser()
  if (!user) {
    return { error: true, message: 'User not authenticated' }
  }

  const displayName = formData.get('displayName') as string
  if (!displayName || !displayName.trim()) {
    return { error: true, message: 'Display name is required' }
  }

  const supabase = createAdminClient()

  // Update the user_profile table and NOT auth metadata
  const { error } = await supabase
    .from('user_profile')
    .update({ name: displayName.trim() })
    .eq('id', user.id)

  if (error) {
    return { error: true, message: 'Failed to update display name' }
  }

  revalidatePath('/profile')
  revalidatePath('/')

  return { error: false, message: 'Display name updated successfully' }
}

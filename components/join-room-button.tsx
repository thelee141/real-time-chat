'use client'

import { useRouter } from 'next/navigation'
import { ComponentProps, useState } from 'react'

import { JoinPasswordDialog } from '@/components/join-password-dialog'
import { ActionButton } from '@/components/ui/action-button'
import { useUser } from '@/contexts/user-context'
import { createClient } from '@/lib/supabase/client'

export function JoinRoomButton({
  children,
  roomId,
  roomName,
  hasPassword,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, 'action'> & {
  roomId: string
  roomName: string
  hasPassword?: boolean
}) {
  const { user } = useUser()
  const router = useRouter()
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  async function joinRoom() {
    if (user == null) {
      return { error: true, message: 'User not logged in' }
    }

    if (hasPassword) {
      setShowPasswordDialog(true)
      return { error: false }
    }

    const supabase = createClient()
    const { error } = await supabase.from('chat_room_member').insert({
      chat_room_id: roomId,
      member_id: user.id,
    })

    if (error) {
      return { error: true, message: 'Failed to join room' }
    }

    router.refresh()
    router.push(`/rooms/${roomId}`)

    return { error: false }
  }

  return (
    <>
      <ActionButton {...props} action={joinRoom}>
        {children}
      </ActionButton>
      <JoinPasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        roomId={roomId}
        roomName={roomName}
      />
    </>
  )
}

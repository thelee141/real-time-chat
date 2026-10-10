import { notFound } from 'next/navigation'

import { RoomClient } from '@/app/rooms/[id]/_client'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [room, user, messages] = await Promise.all([
    getRoom(id),
    getUser(),
    getMessages(id),
  ])

  if (!room || !user) {
    return notFound()
  }

  return <RoomClient room={room} user={user} messages={messages || []} />
}

async function getRoom(id: string) {
  const user = await getCurrentUser()
  if (!user) {
    return null
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, invite_code, is_public, password_hash, chat_room_member!inner (member_id, created_at)')
    .eq('id', id)
    .eq('chat_room_member.member_id', user.id)
    .single()

  if (error) {
    return null
  }

  // Get all members to determine who is the creator (first member)
  const { data: allMembers } = await supabase
    .from('chat_room_member')
    .select('member_id, created_at')
    .eq('chat_room_id', id)
    .order('created_at', { ascending: true })

  const isCreator = allMembers && allMembers.length > 0 && allMembers[0].member_id === user.id

  return {
    id: data.id,
    name: data.name,
    invite_code: data.invite_code,
    is_public: data.is_public,
    has_password: data.password_hash !== null,
    is_creator: isCreator ?? false,
  }
}

async function getMessages(roomId: string) {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('messages')
    .select(
      'id, text, created_at, author_id, deleted_at, edited_at, author:user_profile (name, image_url)',
    )
    .eq('chat_room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return []
  }

  return data
}

async function getUser() {
  const supabase = createAdminClient()
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('user_profile')
    .select('id, name, image_url')
    .eq('id', user.id)
    .single()

  if (error) {
    return null
  }

  return data
}

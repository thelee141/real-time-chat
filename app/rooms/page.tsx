import { MessagesSquareIcon } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AnimatedPage } from '@/components/animated-page'
import { AnimatedRoomList } from '@/components/animated-room-list'
import { CreateRoomDialog } from '@/components/create-room-dialog'
import { JoinRoomByCodeDialog } from '@/components/join-room-by-code-dialog'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { getCurrentUser } from '@/lib/supabase/get-current-user'
import { createAdminClient } from '@/lib/supabase/server'

// generate metadata
export const metadata: Metadata = {
  title: 'Rooms - LinaChat',
  description: 'Your chat rooms',
}

// disable caching to ensure fresh data on every request
export const revalidate = 0

export default async function RoomsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const publicRooms = await getPublicRooms()
  const joinedRooms = await getJoinedRooms(user.id)
  const joinedRoomIds = new Set(joinedRooms.map((r) => r.id))
  const unjoinedRooms = publicRooms.filter((room) => !joinedRoomIds.has(room.id))

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {publicRooms.length === 0 && joinedRooms.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <Empty className="bg-card border shadow-md border-none">
              <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                  <MessagesSquareIcon />
                </EmptyMedia>
                <EmptyTitle>No chat rooms available</EmptyTitle>
                <EmptyDescription>
                  Create a room to start chatting!
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <CreateRoomDialog />
                  <JoinRoomByCodeDialog />
                </div>
              </EmptyContent>
            </Empty>
          </div>
        ) : (
          <>
            <AnimatedRoomList
              title="Your Rooms"
              rooms={joinedRooms}
              isJoined
              showCreateButton={joinedRooms.length > 0}
            />
            <AnimatedRoomList
              title="Public Rooms"
              rooms={unjoinedRooms}
              showCreateButton={
                joinedRooms.length === 0 && unjoinedRooms.length > 0
              }
            />
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

async function getPublicRooms() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select('id, name, is_public, password_hash, chat_room_member (count)')
    .order('name', { ascending: true })

  if (error) return []

  return data.map(({ chat_room_member, id, name, is_public, password_hash }) => ({
    id,
    name,
    member_count: chat_room_member[0].count,
    is_public,
    has_password: password_hash !== null,
  }))
}

async function getJoinedRooms(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('chat_room')
    .select(
      'id, name, is_public, password_hash, chat_room_member (count), joined:chat_room_member!inner(member_id)',
    )
    .eq('joined.member_id', userId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching joined rooms:', error)
    return []
  }

  return data.map(
    ({ chat_room_member, id, name, is_public, password_hash }) => ({
      id,
      name,
      member_count: chat_room_member[0]?.count ?? 0,
      is_public,
      has_password: password_hash !== null,
    }),
  )
}

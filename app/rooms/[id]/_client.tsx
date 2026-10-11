'use client'

import { RealtimeChannel } from '@supabase/supabase-js'
import { AnimatePresence } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ChatInput } from '@/components/chat-input'
import { ChatMessage } from '@/components/chat-message'
import { NewMessagesIndicator } from '@/components/new-messages-indicator'
import { RoomActionsDropdown } from '@/components/room-actions-dropdown'
import { Button } from '@/components/ui/button'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { createClient } from '@/lib/supabase/client'

export type Message = {
  id: string
  text: string
  created_at: string
  author_id: string
  deleted_at: string | null
  edited_at: string | null
  author: {
    name: string
    image_url: string | null
  }
}

export function RoomClient({
  room,
  user,
  messages,
}: {
  user: {
    id: string
    name: string
    image_url: string | null
  }
  room: {
    id: string
    name: string
    invite_code: string
    is_public: boolean
    has_password: boolean
    is_creator: boolean
  }
  messages: Message[]
}) {
  const [sentMessages, setSentMessages] = useState<
    (Message & { status: 'pending' | 'error' | 'success' })[]
  >([])
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const previousRealtimeCountRef = useRef(0)

  const {
    loadMoreMessages,
    messages: oldMessages,
    status,
    triggerQueryRef,
    setMessages: setOldMessages,
  } = useInfiniteScrollChat({
    roomId: room.id,
    startingMessages: messages.toReversed(),
  })

  const handleMessageUpdate = useCallback(
    (messageId: string, updates: Partial<Message>) => {
      setOldMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        ),
      )

      setSentMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, ...updates } : msg,
        ),
      )
    },
    [setOldMessages],
  )

  const { connectedUsers, messages: realtimeMessages } = useRealtimeChat({
    roomId: room.id,
    userId: user.id,
    onMessageUpdate: handleMessageUpdate,
  })

  const visibleMessages = oldMessages.concat(
    realtimeMessages,
    sentMessages.filter((m) => !realtimeMessages.find((rm) => rm.id === m.id)),
  )

  // Track scroll position to determine if user is at bottom
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      // In flex-col-reverse, scrollTop === 0 means at bottom
      // Add small threshold for better UX
      const threshold = 50
      const atBottom = Math.abs(scrollContainer.scrollTop) <= threshold
      setIsAtBottom(atBottom)

      // Clear unread count when user scrolls to bottom
      if (atBottom) {
        setUnreadCount(0)
      }
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  // Track new messages when user is scrolled up
  useEffect(() => {
    const currentRealtimeCount = realtimeMessages.length
    const previousRealtimeCount = previousRealtimeCountRef.current

    // Only increment unread count if:
    // 1. New messages have arrived (count increased)
    // 2. User is not at bottom
    if (currentRealtimeCount > previousRealtimeCount && !isAtBottom) {
      const newMessagesCount = currentRealtimeCount - previousRealtimeCount
      setUnreadCount((prev) => prev + newMessagesCount)
    }

    previousRealtimeCountRef.current = currentRealtimeCount
  }, [realtimeMessages.length, isAtBottom])

  const scrollToBottom = useCallback(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    scrollContainer.scrollTo({
      top: 0, // In flex-col-reverse, 0 is bottom
      behavior: 'smooth',
    })
    setUnreadCount(0)
  }, [])

  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col">
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="border-b">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {room.name}
            {room.has_password && (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
          </h1>
          <p className="text-muted-foreground text-sm">
            {connectedUsers} {connectedUsers === 1 ? 'user' : 'users'} online
          </p>
        </div>
        <RoomActionsDropdown
          roomId={room.id}
          inviteCode={room.invite_code}
          isCreator={room.is_creator}
          isPublic={room.is_public}
        />
      </div>
      <div
        ref={scrollContainerRef}
        className="grow overflow-y-auto flex flex-col-reverse"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border) transparent',
        }}
      >
        <div>
          {status === 'loading' && (
            <p className="text-center text-sm text-muted-foreground py-2">
              Loading more messages...
            </p>
          )}
          {status === 'error' && (
            <div className="text-center">
              <p className="text-sm text-destructive py-2">
                Error loading messages.
              </p>
              <Button onClick={loadMoreMessages} variant="outline">
                Retry
              </Button>
            </div>
          )}
          {visibleMessages.length === 0 && status !== 'loading' && (
            <Empty className="flex">
              <EmptyHeader className="opacity-50">
                <EmptyTitle>
                  No messages yet. Start the conversation!
                </EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
          <AnimatePresence initial={false}>
            {visibleMessages.map((message, index) => (
              <ChatMessage
                key={message.id}
                {...message}
                currentUserId={user.id}
                ref={index === 0 && status === 'idle' ? triggerQueryRef : null}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      <NewMessagesIndicator
        count={unreadCount}
        onClick={scrollToBottom}
        show={!isAtBottom}
      />
      <ChatInput
        roomId={room.id}
        onSend={(message) => {
          setSentMessages((prev) => [
            ...prev,
            {
              id: message.id,
              text: message.text,
              created_at: new Date().toISOString(),
              author_id: user.id,
              deleted_at: null,
              edited_at: null,
              author: {
                name: user.name,
                image_url: user.image_url,
              },
              status: 'pending',
            },
          ])
        }}
        onSuccessfulSend={(message) => {
          setSentMessages((prev) =>
            prev.map((m) =>
              m.id === message.id ? { ...message, status: 'success' } : m,
            ),
          )
        }}
        onErrorSend={(id) => {
          setSentMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: 'error' } : m)),
          )
        }}
      />
    </div>
  )
}

function useRealtimeChat({
  roomId,
  userId,
  onMessageUpdate,
}: {
  roomId: string
  userId: string
  onMessageUpdate?: (messageId: string, updates: Partial<Message>) => void
}) {
  const [connectedUsers, setConnectedUsers] = useState(1)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const supabase = createClient()
    let newChannel: RealtimeChannel
    let cancel = false

    supabase.realtime.setAuth().then(() => {
      if (cancel) return

      newChannel = supabase.channel(`room:${roomId}:messages`, {
        config: {
          private: true,
          presence: {
            key: userId,
          },
        },
      })

      newChannel
        .on('presence', { event: 'sync' }, () => {
          setConnectedUsers(Object.keys(newChannel.presenceState()).length)
        })
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_room_id=eq.${roomId}`,
          },
          (payload) => {
            const record = payload.new as any
            // The trigger enriches the record with author info
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                id: record.id,
                text: record.text,
                created_at: record.created_at,
                author_id: record.author_id,
                deleted_at: record.deleted_at || null,
                edited_at: record.edited_at || null,
                author: {
                  name: record.author_name,
                  image_url: record.author_image_url,
                },
              },
            ])
          },
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `chat_room_id=eq.${roomId}`,
          },
          (payload) => {
            const record = payload.new as any
            const updates = {
              text: record.text,
              deleted_at: record.deleted_at || null,
              edited_at: record.edited_at || null,
            }
            // Update the message in the realtime list
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === record.id ? { ...msg, ...updates } : msg,
              ),
            )
            // Notify parent component to update other message lists
            onMessageUpdate?.(record.id, updates)
          },
        )
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') return

          newChannel.track({ userId })
        })
    })

    return () => {
      cancel = true
      if (!newChannel) return
      newChannel.untrack()
      newChannel.unsubscribe()
    }
  }, [roomId, userId, onMessageUpdate])

  return { connectedUsers, messages }
}

const LIMIT = 25
function useInfiniteScrollChat({
  startingMessages,
  roomId,
}: {
  startingMessages: Message[]
  roomId: string
}) {
  const [messages, setMessages] = useState<Message[]>(startingMessages)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>(
    startingMessages.length === 0 ? 'done' : 'idle',
  )

  async function loadMoreMessages() {
    if (status === 'done' || status === 'loading') return
    const supabase = createClient()
    setStatus('loading')

    const { data, error } = await supabase
      .from('messages')
      .select(
        'id, text, created_at, author_id, deleted_at, edited_at, author:user_profile (name, image_url)',
      )
      .eq('chat_room_id', roomId)
      .lt('created_at', messages[0].created_at)
      .order('created_at', { ascending: false })
      .limit(LIMIT)

    if (error) {
      setStatus('error')
      return
    }

    setMessages((prev) => [...data.toReversed(), ...prev])
    setStatus(data.length < LIMIT ? 'done' : 'idle')
  }

  function triggerQueryRef(node: HTMLDivElement | null) {
    if (node == null) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target === node) {
            observer.unobserve(node)
            loadMoreMessages()
          }
        })
      },
      {
        rootMargin: '50px',
      },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }

  return { loadMoreMessages, messages, status, triggerQueryRef, setMessages }
}

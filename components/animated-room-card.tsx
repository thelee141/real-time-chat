'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Link from 'next/link'

import { JoinRoomButton } from '@/components/join-room-button'
import { LeaveRoomButton } from '@/components/leave-room-button'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cardHoverVariants } from '@/lib/animations'

/**
 * Animated room card with hover effects
 */
export function AnimatedRoomCard({
  id,
  name,
  member_count,
  isJoined,
  has_password,
}: {
  id: string
  name: string
  member_count: number
  isJoined: boolean
  has_password?: boolean
}) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHoverVariants}
    >
      <Card className="h-full relative">
        {has_password && !isJoined && (
          <div className="absolute top-3 right-3 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
        )}
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {member_count} {member_count === 1 ? 'member' : 'members'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-2 flex-col">
          {isJoined ? (
            <>
              <Button asChild className="w-full grow" size="sm">
                <Link href={`/rooms/${id}`}>Enter</Link>
              </Button>
              <LeaveRoomButton
                roomId={id}
                size="sm"
                variant="secondary"
                className="w-full"
              >
                Leave
              </LeaveRoomButton>
            </>
          ) : (
            <JoinRoomButton
              roomId={id}
              roomName={name}
              variant="outline"
              className="w-full"
              size="sm"
              hasPassword={has_password}
            >
              Join
            </JoinRoomButton>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

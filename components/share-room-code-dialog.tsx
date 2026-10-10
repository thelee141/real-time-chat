'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { regenerateRoomCode } from '@/actions/rooms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { LoadingSwap } from './ui/loading-swap'

export function ShareRoomCodeDialog({
  roomId,
  inviteCode,
  isCreator,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: {
  roomId: string
  inviteCode: string
  isCreator: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen
  const [copied, setCopied] = useState(false)
  const [currentCode, setCurrentCode] = useState(inviteCode)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  useEffect(() => {
    if (minutesRemaining !== null && minutesRemaining > 0) {
      const timer = setTimeout(() => {
        setMinutesRemaining((prev) =>
          prev !== null && prev > 0 ? prev - 1 : null,
        )
      }, 60000) // Update every minute
      return () => clearTimeout(timer)
    }
  }, [minutesRemaining])

  // Sync currentCode with inviteCode prop changes (e.g., when another user regenerates)
  useEffect(() => {
    if (currentCode !== inviteCode) {
      setCurrentCode(inviteCode)
      // Only reset countdown if user is not creator or countdown wasn't active
      if (!isCreator || minutesRemaining === null) {
        setMinutesRemaining(null)
      }
    }
  }, [inviteCode, currentCode, isCreator, minutesRemaining])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode)
      setCopied(true)
      toast.success('Room code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy room code')
    }
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    const res = await regenerateRoomCode(roomId)

    if (res.error) {
      toast.error(res.message)
      if ('minutesRemaining' in res && res.minutesRemaining) {
        setMinutesRemaining(res.minutesRemaining)
      }
    } else if (res.inviteCode) {
      setCurrentCode(res.inviteCode)
      toast.success('Room code regenerated successfully!')
      setMinutesRemaining(60) // Set 1 hour countdown
      router.refresh()
    }

    setIsRegenerating(false)
  }

  // Format code with dashes for readability (e.g., a7K9-mP4x-Q2n)
  const formattedCode = currentCode.match(/.{1,4}/g)?.join('-') || currentCode

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Room Code</DialogTitle>
          <DialogDescription>
            Share this code with others to invite them to this room. Anyone with
            this code can join.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Room Code Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Room Code</p>
            <p className="text-2xl font-mono font-bold tracking-wider select-all">
              {formattedCode}
            </p>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopy}
            className="w-full"
            variant="default"
            disabled={copied}
          >
            {copied ? (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>

          {/* Regenerate Button (only for creator) */}
          {isCreator && (
            <div className="space-y-2">
              <Button
                onClick={handleRegenerate}
                variant="outline"
                className="w-full"
                disabled={
                  isRegenerating ||
                  (minutesRemaining !== null && minutesRemaining > 0)
                }
              >
                <LoadingSwap isLoading={isRegenerating}>
                  {minutesRemaining !== null && minutesRemaining > 0
                    ? `Regenerate (wait ${minutesRemaining}m)`
                    : 'Regenerate Code'}
                </LoadingSwap>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Only room creators can regenerate codes (max once per hour)
              </p>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

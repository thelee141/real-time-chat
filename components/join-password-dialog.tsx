'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { verifyPasswordAndJoinRoom } from '@/actions/rooms'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoadingSwap } from '@/components/ui/loading-swap'

export function JoinPasswordDialog({
  open,
  onOpenChange,
  roomId,
  roomName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: string
  roomName: string
}) {
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await verifyPasswordAndJoinRoom({
      roomId,
      password,
    })

    if (result.error) {
      setError(result.message)
      setIsSubmitting(false)
    } else {
      toast.success('', {
        description: 'You have joined the room',
      })
      onOpenChange(false)
      setPassword('')
      router.refresh()
      router.push(`/rooms/${roomId}`)
    }
  }

  function handleOpenChange(open: boolean) {
    setError(null)
    setPassword('')
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Password Required</DialogTitle>
          <DialogDescription>
            Enter the password for room: <strong>{roomName}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              aria-invalid={!!error}
            />
            {error && <FieldError errors={[{ message: error }]} />}
          </Field>
          <div className="flex gap-2">
            <Button type="submit" className="grow" disabled={isSubmitting}>
              <LoadingSwap isLoading={isSubmitting}>Join Room</LoadingSwap>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

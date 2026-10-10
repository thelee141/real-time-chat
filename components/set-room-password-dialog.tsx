'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { toggleRoomPrivacy } from '@/actions/rooms'
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

export function SetRoomPasswordDialog({
  open,
  onOpenChange,
  roomId,
  makePublic,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomId: string
  makePublic: boolean
}) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
  }>({})
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate if making private
    if (!makePublic) {
      const newErrors: { password?: string; confirmPassword?: string } = {}

      if (!password) {
        newErrors.password = 'Password is required'
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsSubmitting(false)
        return
      }
    }

    const result = await toggleRoomPrivacy({
      roomId,
      makePublic,
      password: !makePublic ? password : undefined,
    })

    if (result.error) {
      toast.error(result.message)
      setIsSubmitting(false)
    } else {
      toast.success(result.message)
      setIsSubmitting(false)
      onOpenChange(false)
      setPassword('')
      setConfirmPassword('')
      router.refresh()
    }
  }

  function handleOpenChange(open: boolean) {
    setErrors({})
    setPassword('')
    setConfirmPassword('')
    onOpenChange(open)
  }

  // For making room public - confirmation dialog
  if (makePublic) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make Room Public?</DialogTitle>
            <DialogDescription>
              This will remove password protection and make the room visible in
              the public rooms list. Anyone can join without a password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>
                  Make Public
                </LoadingSwap>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  // For making room private - password entry dialog
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make Room Private</DialogTitle>
          <DialogDescription>
            Set a password to protect this room. Only users with the password
            can join.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (min 6 characters)"
              disabled={isSubmitting}
              required
            />
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              disabled={isSubmitting}
              required
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword}</FieldError>
            )}
          </Field>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <LoadingSwap isLoading={isSubmitting}>Make Private</LoadingSwap>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

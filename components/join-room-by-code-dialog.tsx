'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SetStateAction, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { joinRoomByCode } from '@/actions/rooms'
import { JoinPasswordDialog } from '@/components/join-password-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { roomCodeSchema } from '@/lib/schemas/room'

import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { LoadingSwap } from './ui/loading-swap'

const formSchema = z.object({
  roomCode: roomCodeSchema,
})

type FormData = z.infer<typeof formSchema>

export function JoinRoomByCodeDialog() {
  const [open, setOpen] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [pendingRoom, setPendingRoom] = useState<{ id: string; name: string } | null>(null)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomCode: '',
    },
  })

  async function onSubmit(data: FormData) {
    const res = await joinRoomByCode(data.roomCode)

    if (res.error) {
      toast.error(res.message)
      return
    }

    // If room requires password, show password dialog
    if (res.requiresPassword && res.roomId && res.roomName) {
      setOpen(false)
      setPendingRoom({ id: res.roomId, name: res.roomName })
      setShowPasswordDialog(true)
      return
    }

    // Successfully joined without password
    if (res.roomId) {
      setOpen(false)
      toast.success('Successfully joined room!')
      router.refresh()
      router.push(`/rooms/${res.roomId}`)
    }
  }

  const handleOpenChange = (open: SetStateAction<boolean>) => {
    setOpen(open)
    form.reset({
      roomCode: '',
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <KeyRoundIcon className="w-4 h-4" />
            Join Room via Code
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Join Room via Code</DialogTitle>
            <DialogDescription>
              Enter the room code you received to join the chat room.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="roomCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="room-code">Room Code</FieldLabel>
                    <Input
                      {...field}
                      id="room-code"
                      placeholder="e.g., a7K9mP4xQ2n"
                      aria-invalid={fieldState.invalid}
                      className="font-mono"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field orientation="horizontal" className="w-full">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="grow"
                >
                  <LoadingSwap isLoading={form.formState.isSubmitting}>
                    Join Room
                  </LoadingSwap>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>

      {pendingRoom && (
        <JoinPasswordDialog
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
          roomId={pendingRoom.id}
          roomName={pendingRoom.name}
        />
      )}
    </>
  )
}

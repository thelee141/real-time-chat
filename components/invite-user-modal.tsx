'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SetStateAction, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { addUserToRoom } from '@/actions/rooms'
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

import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field'
import { LoadingSwap } from './ui/loading-swap'

const formSchema = z.object({
  userId: z.string().min(1).trim(),
})

type FormData = z.infer<typeof formSchema>

export function InviteUserModal({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
    },
  })

  async function onSubmit(data: FormData) {
    const res = await addUserToRoom({ roomId, userId: data.userId })

    if (res.error) {
      toast.error(res.message)
    } else {
      setOpen(false)
      router.refresh()
    }
  }

  const handleOpenChange = (open: SetStateAction<boolean>) => {
    setOpen(open)
    form.reset({
      userId: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserPlusIcon className="w-4 h-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite User to Room</DialogTitle>
          <DialogDescription>
            Enter the user ID of the person you want to invite to this chat
            room.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="userId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="user-id">User ID</FieldLabel>
                  <Input
                    {...field}
                    id="user-id"
                    aria-invalid={fieldState.invalid}
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
                  Invite User
                </LoadingSwap>
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

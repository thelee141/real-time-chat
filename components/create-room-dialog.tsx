'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckIcon, CopyIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { createRoom } from '@/actions/rooms'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { CreateRoomData, createRoomSchema } from '@/lib/schemas/room'

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const form = useForm<CreateRoomData>({
    defaultValues: {
      name: '',
      isPublic: false,
      password: '',
    },
    resolver: zodResolver(createRoomSchema),
  })

  const isPublic = form.watch('isPublic')

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  const handleCopy = async () => {
    if (!inviteCode) return
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      toast.success('Room code copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy room code')
    }
  }

  const handleGoToRoom = () => {
    if (roomId) {
      setOpen(false)
      setShowSuccess(false)
      form.reset()
      router.push(`/rooms/${roomId}`)
    }
  }

  async function handleSubmit(data: CreateRoomData) {
    const result = await createRoom(data)
    if (result.error) {
      toast.error('Error', {
        description: result.message,
      })
    } else if (result.inviteCode && result.roomId) {
      setInviteCode(result.inviteCode)
      setRoomId(result.roomId)
      setShowSuccess(true)
    }
  }

  const formattedCode = inviteCode?.match(/.{1,4}/g)?.join('-') || inviteCode

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Room</Button>
      </DialogTrigger>
      <DialogContent>
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>New Room</DialogTitle>
              <DialogDescription>Create a new room</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Room Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />
            <Controller
              name="isPublic"
              control={form.control}
              render={({
                field: { onChange, value, ...field },
                fieldState,
              }) => {
                return (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation={'horizontal'}
                  >
                    <Checkbox
                      {...field}
                      id={field.name}
                      onCheckedChange={onChange}
                      checked={value}
                      aria-invalid={fieldState.invalid}
                      disabled={form.formState.isSubmitting}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={field.name} className="font-normal">
                        Public Room
                      </FieldLabel>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )
              }}
            />
            {!isPublic && (
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="password"
                        aria-invalid={fieldState.invalid}
                        disabled={form.formState.isSubmitting}
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )
                }}
              />
            )}
            <Field orientation={'horizontal'} className="w-full">
              <Button className="grow" type="submit">
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Create Room
                </LoadingSwap>
              </Button>
              <Button
                variant={'outline'}
                type="button"
                onClick={() => setOpen(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
            </Field>
          </FieldGroup>
        </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Room Created Successfully!</DialogTitle>
              <DialogDescription>
                Share this code with others to invite them to your room.
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

              {/* Go to Room Button */}
              <Button onClick={handleGoToRoom} className="w-full" variant="outline">
                Go to Room
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

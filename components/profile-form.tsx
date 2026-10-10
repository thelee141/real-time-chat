'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { UpdateDisplayNameState } from '@/actions/user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      isLoading={pending}
      className="w-24"
    >
      Save
    </Button>
  )
}

interface ProfileFormProps {
  initialDisplayName: string
  updateAction: (
    prevState: UpdateDisplayNameState,
    formData: FormData,
  ) => Promise<UpdateDisplayNameState>
}

export function ProfileForm({
  initialDisplayName,
  updateAction,
}: ProfileFormProps) {
  const [state, formAction] = useActionState(updateAction, {
    error: false,
    message: '',
  })

  useEffect(() => {
    if (state?.message) {
      state.error
        ? toast.error(state.message, { dismissible: true })
        : toast.success(state.message, { dismissible: true })
    }
  }, [state])

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
          <CardDescription>
            This is your public display name. It can be your real name or a
            pseudonym.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input name="displayName" defaultValue={initialDisplayName} />
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  )
}

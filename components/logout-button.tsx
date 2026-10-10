'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (_err) {
      // error state
    } finally {
      setTimeout(() => setIsLoading(false), 250) // cleaner animation
    }
  }

  return (
    <Button
      onClick={logout}
      disabled={isLoading}
      className={'w-28'}
      size={'sm'}
      variant={'outline'}
    >
      {isLoading ? <Spinner /> : <span>Logout</span>}
    </Button>
  )
}

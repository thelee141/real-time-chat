'use client'

import { Cat, User2Icon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { LogoutButton } from '@/components/logout-button'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useUser } from '@/contexts/user-context'
import { createClient } from '@/lib/supabase/client'

export function Navbar() {
  const { isLoading, user } = useUser()
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const supabase = createClient()
      supabase
        .from('user_profile')
        .select('name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setDisplayName(data.name)
          }
        })
    }
  }, [user])

  return (
    <div className="border-b bg-background h-header">
      <nav className="container mx-auto justify-between items-center px-4 flex h-full gap-4">
        <Link
          href="/"
          className="text-xl font-black font-poppins tracking-tight flex items-center gap-1"
        >
          <Cat />
          LinaChat
        </Link>

        <div className="flex items-center gap-1">
          <ModeToggle />
          {isLoading ? (
            <div>
              <Spinner />
            </div>
          ) : !user ? (
            <></>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:block">
                Hello, {displayName || user.email}
              </span>
              <span>
                <Button asChild variant={'ghost'} size={'sm'}>
                  <Link href={'/profile'}>
                    <User2Icon size={15} />
                  </Link>
                </Button>
              </span>
              <LogoutButton />
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

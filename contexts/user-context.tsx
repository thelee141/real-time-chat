'use client'

import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { createClient } from '@/lib/supabase/client'

interface UserContextType {
  user: User | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
  initialUser?: User | null
}

export function UserProvider({
  children,
  initialUser = null,
}: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(!initialUser)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Only fetch if we don't have initial user data
    if (!initialUser) {
      supabase.auth
        .getUser()
        .then(({ error, data }) => {
          if (!error && data?.user) {
            setUser(data.user)
          }
        })
        .finally(() => setIsLoading(false))
    }

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)

      // Redirect to home if user logs out
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser, router])

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { buttonPressVariants, slideUpVariants } from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingGithub, setIsLoadingGithub] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoadingEmail(true)
    setEmailError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setEmailError(error.message)
      setIsLoadingEmail(false)
      return
    }

    onOpenChange(false)
    router.push('/rooms')
    router.refresh()
  }

  const handleIsLoading = (provider: 'github' | 'google') => {
    setIsLoading(true)
    if (provider === 'github') {
      setIsLoadingGithub(true)
    } else {
      setIsLoadingGoogle(true)
    }
  }

  const handleSocialLogin = async (
    provider: 'github' | 'google',
    e: React.FormEvent,
  ) => {
    e.preventDefault()
    const supabase = createClient()
    handleIsLoading(provider)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/rooms`,
          queryParams: {
            ...(provider === 'google' && {
              access_type: 'offline',
              prompt: 'consent',
            }),
          },
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
      setIsLoadingGithub(false)
      setIsLoadingGoogle(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to LinaChat
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to start chatting with your friends
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideUpVariants}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            whileHover={!isLoading ? 'hover' : 'rest'}
            whileTap={!isLoading ? 'press' : 'rest'}
            variants={buttonPressVariants}
          >
            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={(e: React.FormEvent) => handleSocialLogin('github', e)}
            >
              {isLoadingGithub ? (
                'Logging in...'
              ) : (
                <div className="flex gap-2 items-center">
                  <FaGithub />
                  Continue with GitHub
                </div>
              )}
            </Button>
          </motion.div>

          <motion.div
            whileHover={!isLoading ? 'hover' : 'rest'}
            whileTap={!isLoading ? 'press' : 'rest'}
            variants={buttonPressVariants}
          >
            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={(e: React.FormEvent) => handleSocialLogin('google', e)}
            >
              {isLoadingGoogle ? (
                'Logging in...'
              ) : (
                <div className="flex gap-2 items-center">
                  <FaGoogle />
                  Continue with Google
                </div>
              )}
            </Button>
          </motion.div>

          {process.env.NODE_ENV === 'development' && (
            <form
              onSubmit={handleEmailLogin}
              className="flex flex-col gap-3 border-t pt-4"
            >
              <p className="text-xs text-muted-foreground">
                Dev-only email sign-in (local Supabase stack). Seeded accounts:
                alice@example.com / bob@example.com, password "password123".
              </p>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {emailError && (
                <p className="text-sm text-destructive text-center">
                  {emailError}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={isLoadingEmail || isLoading}
              >
                {isLoadingEmail ? 'Logging in...' : 'Sign in with email'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

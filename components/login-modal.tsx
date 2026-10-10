'use client'

import { AnimatePresence, motion } from 'framer-motion'
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

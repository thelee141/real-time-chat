'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Cat, Lock, MessagesSquare, Moon, Zap } from 'lucide-react'
import { useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import {
  buttonPressVariants,
  pageVariants,
  slideUpVariants,
  staggerContainerVariants,
} from '@/lib/animations'
import { createClient } from '@/lib/supabase/client'

import { FeatureHighlight } from './feature-highlight'

export function LoginHero() {
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
          redirectTo: `${window.location.origin}/auth/oauth?next=/`,
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
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen-with-header flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 lg:p-12"
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-12 text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center"
          >
            <Cat className="w-12 h-12 text-primary" />
          </motion.div>

          {/* Title */}
          <div className="space-y-4">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-geist tracking-tight"
            >
              Stay connected with your friends
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Join LinaChat for instant messaging with friends and communities
            </motion.p>
          </div>

          {/* Features Section */}
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
          >
            <FeatureHighlight
              icon={Zap}
              title="Lightning-Fast"
              description="Real-time conversations with zero lag"
            />
            <FeatureHighlight
              icon={Lock}
              title="Secure Rooms"
              description="Password-protected for your team"
            />
            <FeatureHighlight
              icon={MessagesSquare}
              title="Public Communities"
              description="Join chat rooms instantly"
            />
            <FeatureHighlight
              icon={Moon}
              title="Dark Mode"
              description="Easy on the eyes, day or night"
            />
          </motion.div>

          {/* Login Buttons */}
          <div className="flex flex-col gap-4 w-full max-w-md">
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideUpVariants}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
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
        </div>
      </div>
    </motion.div>
  )
}

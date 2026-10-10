'use client'

import { User } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { LoginModal } from '@/components/login-modal'
import { Button } from '@/components/ui/button'
import { pageVariants } from '@/lib/animations'

interface HomeHeroProps {
  user?: User | null
}

export function HomeHero({ user }: HomeHeroProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-2xl bg-primary/10 mb-4"
            >
              <MessageSquare className="w-12 h-12 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/50"
            >
              Connect Instantly with
              <br />
              <span className="text-foreground">LinaChat</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
            >
              Experience seamless, real-time communication. Join public rooms or create private spaces for your team and friends.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 min-w-[200px]"
            >
              {user ? (
                <Button asChild size="lg" className="gap-2">
                  <Link href="/rooms">
                    View Rooms <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" className="gap-2" onClick={() => setShowLoginModal(true)}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-r from-primary to-purple-500 rounded-full blur-3xl" />
        </div>
      </motion.div>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}

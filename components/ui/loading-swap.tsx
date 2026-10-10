'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2Icon } from 'lucide-react'
import type { ReactNode } from 'react'

import { crossfadeVariants } from '@/lib/animations'
import { cn } from '@/lib/utils'

export function LoadingSwap({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className="grid grid-cols-1 items-center justify-items-center">
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            className={cn(
              'col-start-1 col-end-2 row-start-1 row-end-2',
              className,
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={crossfadeVariants}
          >
            <Loader2Icon className="animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className={cn(
              'col-start-1 col-end-2 row-start-1 row-end-2 w-full',
              className,
            )}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={crossfadeVariants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

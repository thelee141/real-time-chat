'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

import { Button } from './ui/button'

interface NewMessagesIndicatorProps {
  count: number
  onClick: () => void
  show: boolean
}

export function NewMessagesIndicator({
  count,
  onClick,
  show,
}: NewMessagesIndicatorProps) {
  return (
    <AnimatePresence>
      {show && count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-24 z-50"
        >
          <Button
            onClick={onClick}
            className="flex items-center gap-2 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
            size="lg"
          >
            <ArrowDown className="h-4 w-4" />
            <span className="font-semibold">
              {count} {count === 1 ? 'new message' : 'new messages'}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

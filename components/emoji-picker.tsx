'use client'

import type { EmojiClickData, Theme } from 'emoji-picker-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Smile } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import { InputGroupButton } from '@/components/ui/input-group'

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false })

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

const buttonPressVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
  press: { scale: 0.95 },
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji)
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Don't close if clicking on the button or inside the picker
      if (
        buttonRef.current?.contains(target) ||
        containerRef.current?.contains(target)
      ) {
        return
      }

      setOpen(false)
    }

    // Handle escape key to close
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  return (
    <div className="relative">
      <motion.div
        initial="rest"
        whileHover="hover"
        whileTap="press"
        variants={buttonPressVariants}
      >
        <InputGroupButton
          ref={buttonRef}
          type="button"
          aria-label="Add emoji"
          title="Add emoji"
          size="icon-sm"
          onClick={() => setOpen(!open)}
        >
          <Smile className="size-4" />
        </InputGroupButton>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 z-50"
          >
            <Picker
              onEmojiClick={handleEmojiClick}
              theme={'dark' as Theme}
              skinTonesDisabled
              searchPlaceHolder="Search emojis..."
              previewConfig={{
                showPreview: false,
              }}
              height={400}
              width="100%"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

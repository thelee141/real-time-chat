'use client'

import { motion } from 'framer-motion'
import { SendIcon } from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Message } from '@/app/rooms/[id]/_client'
import { buttonPressVariants } from '@/lib/animations'
import { sendMessage } from '@/lib/supabase/send-message'

import { EmojiPicker } from './emoji-picker'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from './ui/input-group'

type Props = {
  roomId: string
  onSend: (message: { id: string; text: string }) => void
  onSuccessfulSend: (message: Message) => void
  onErrorSend: (id: string) => void
}

export function ChatInput({
  roomId,
  onSend,
  onSuccessfulSend,
  onErrorSend,
}: Props) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    const text = message.trim()
    if (!text) return

    setMessage('')
    const id = crypto.randomUUID()
    onSend({ id, text })
    const result = await sendMessage({ id, text, roomId })
    if (result.error) {
      toast.error(result.message)
      onErrorSend(id)
    } else {
      onSuccessfulSend(result.message)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current
    if (!textarea) {
      setMessage((prev) => prev + emoji)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = message
    const before = text.substring(0, start)
    const after = text.substring(end)
    const newText = before + emoji + after

    setMessage(newText)

    // Set cursor position after emoji
    setTimeout(() => {
      const newPosition = start + emoji.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    }, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <InputGroup>
        <InputGroupTextarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field-sizing-content min-h-auto"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />
        <InputGroupAddon align="inline-end" className="gap-0">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          <motion.div
            initial="rest"
            whileHover="hover"
            whileTap="press"
            variants={buttonPressVariants}
          >
            <InputGroupButton
              type="submit"
              aria-label="Send"
              title="Send"
              size="icon-sm"
            >
              <SendIcon />
            </InputGroupButton>
          </motion.div>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}

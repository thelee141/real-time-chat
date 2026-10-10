'use client'

import { motion } from 'framer-motion'
import { MoreVertical, Pencil, Trash2, User2Icon } from 'lucide-react'
import Image from 'next/image'
import { Ref, useState } from 'react'
import { toast } from 'sonner'

import { Message } from '@/app/rooms/[id]/_client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { Textarea } from '@/components/ui/textarea'
import { fastStaggerContainerVariants, slideUpVariants, staggerItemVariants } from '@/lib/animations'
import { deleteMessage } from '@/lib/supabase/delete-message'
import { editMessage } from '@/lib/supabase/edit-message'
import { cn } from '@/lib/utils'

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function ChatMessage({
  id,
  text,
  author,
  author_id,
  created_at,
  deleted_at,
  edited_at,
  status,
  currentUserId,
  ref,
}: Message & {
  status?: 'pending' | 'error' | 'success'
  currentUserId?: string
  ref?: Ref<HTMLDivElement>
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(text)
  const [isSaving, setIsSaving] = useState(false)

  const isOwnMessage = currentUserId === author_id
  const isDeleted = deleted_at !== null
  const wasEdited = edited_at !== null

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteMessage({ messageId: id })
      if (result.error) {
        toast.error(result.message)
      }
      setShowDeleteDialog(false)
      setIsDropdownOpen(false)
    } catch (error) {
      toast.error('Failed to delete message')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleSaveEdit() {
    if (!editedText.trim() || editedText === text) {
      setIsEditing(false)
      setEditedText(text)
      return
    }

    setIsSaving(true)
    try {
      const result = await editMessage({ messageId: id, newText: editedText })
      if (result.error) {
        toast.error(result.message)
      } else {
        setIsEditing(false)
      }
    } catch (error) {
      toast.error('Failed to edit message')
    } finally {
      setIsSaving(false)
    }
  }

  function handleCancelEdit() {
    setEditedText(text)
    setIsEditing(false)
  }

  function handleStartEdit() {
    setEditedText(text)
    setIsEditing(true)
    setIsDropdownOpen(false)
  }

  return (
    <>
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={slideUpVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'flex gap-4 px-4 py-2 hover:bg-accent/50 group relative',
          status === 'pending' && 'opacity-70',
          status === 'error' && 'bg-destructive/10 text-destructive',
        )}
        data-is-own-message={isOwnMessage}
        data-is-deleted={isDeleted}
        data-is-hovered={isHovered}
      >
        <motion.div className="shrink-0" variants={staggerItemVariants}>
          {author.image_url != null ? (
            <Image
              src={author.image_url}
              alt={author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="size-10 rounded-full flex items-center justify-center border bg-muted text-muted-foreground overflow-hidden">
              <User2Icon className="size-[30px] mt-2.5" />
            </div>
          )}
        </motion.div>
        <motion.div
          className="grow space-y-0.5"
          variants={fastStaggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div className="flex items-baseline gap-2" variants={staggerItemVariants}>
            <span className="text-sm font-semibold">{author.name}</span>
            <span className="text-xs text-muted-foreground">
              {DATE_FORMATTER.format(new Date(created_at))}
            </span>
            {wasEdited && !isDeleted && (
              <span className="text-xs text-muted-foreground italic">(edited)</span>
            )}
          </motion.div>
          {isEditing ? (
            <motion.div className="space-y-2" variants={staggerItemVariants}>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSaveEdit()
                  }
                  if (e.key === 'Escape') {
                    handleCancelEdit()
                  }
                }}
                className="min-h-[60px] text-sm resize-none"
                autoFocus
                disabled={isSaving}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editedText.trim()}
                >
                  <LoadingSwap isLoading={isSaving}>Save</LoadingSwap>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.p
              className={cn(
                "text-sm break-words whitespace-pre-wrap overflow-hidden",
                isDeleted && "italic text-muted-foreground"
              )}
              variants={staggerItemVariants}
            >
              {isDeleted ? 'This message has been deleted' : text}
            </motion.p>
          )}
        </motion.div>

        {/* Show dropdown menu only for own messages that aren't deleted and not being edited */}
        {isOwnMessage && !isDeleted && !isEditing && (
          <div className={cn(
            "absolute right-4 top-2 transition-opacity duration-150",
            isHovered || isDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleStartEdit}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This message will be replaced with "This message has been deleted" for all members of the chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <LoadingSwap isLoading={isDeleting}>Delete</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

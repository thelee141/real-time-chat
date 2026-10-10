'use client'

import {
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { SetRoomPasswordDialog } from './set-room-password-dialog'
import { ShareRoomCodeDialog } from './share-room-code-dialog'

export function RoomActionsDropdown({
  roomId,
  inviteCode,
  isCreator,
  isPublic,
}: {
  roomId: string
  inviteCode: string
  isCreator: boolean
  isPublic: boolean
}) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false)
  const [makePublic, setMakePublic] = useState(false)

  function handleShareClick() {
    setShareDialogOpen(true)
  }

  function handleTogglePrivacy() {
    setMakePublic(isPublic ? false : true)
    setPrivacyDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <MoreHorizontalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleShareClick}>
            <ShareIcon className="w-4 h-4 mr-2" />
            Share Room Code
          </DropdownMenuItem>
          {isCreator && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleTogglePrivacy}>
                {isPublic ? (
                  <>
                    <LockIcon className="w-4 h-4 mr-2" />
                    Make Room Private
                  </>
                ) : (
                  <>
                    <GlobeIcon className="w-4 h-4 mr-2" />
                    Make Room Public
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Share Room Code Dialog */}
      <ShareRoomCodeDialog
        roomId={roomId}
        inviteCode={inviteCode}
        isCreator={isCreator}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />

      {/* Privacy Toggle Dialog */}
      {isCreator && (
        <SetRoomPasswordDialog
          open={privacyDialogOpen}
          onOpenChange={setPrivacyDialogOpen}
          roomId={roomId}
          makePublic={makePublic}
        />
      )}
    </>
  )
}

"use client";

import { AnimatePresence, motion } from "framer-motion";

import { AnimatedRoomCard } from "@/components/animated-room-card";
import { CreateRoomDialog } from "@/components/create-room-dialog";
import { JoinRoomByCodeDialog } from "@/components/join-room-by-code-dialog";
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations";

/**
 * Animated room list with staggered card animations
 */
export function AnimatedRoomList({
  title,
  rooms,
  isJoined = false,
  showCreateButton = false,
}: {
  title: string;
  rooms: { id: string; name: string; member_count: number; has_password?: boolean; is_public?: boolean }[];
  isJoined?: boolean;
  showCreateButton?: boolean;
}) {
  if (rooms.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl">{title}</h2>
        {showCreateButton && (
          <div className="flex gap-2">
            <CreateRoomDialog />
            <JoinRoomByCodeDialog />
          </div>
        )}
      </div>
      <motion.div
        className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {rooms.map((room) => (
            <motion.div
              key={`${room.id}-${isJoined ? 'joined' : 'public'}`}
              variants={staggerItemVariants}
              layout
              exit="exit"
            >
              <AnimatedRoomCard {...room} isJoined={isJoined} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

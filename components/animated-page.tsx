"use client";

import { motion } from "framer-motion";

import { pageVariants } from "@/lib/animations";

/**
 * Animated page wrapper for consistent page transitions
 */
export function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

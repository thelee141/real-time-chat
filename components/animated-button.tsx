'use client'

import { motion } from 'framer-motion'
import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { buttonPressVariants } from '@/lib/animations'

/**
 * Animated button wrapper that adds subtle press and hover effects
 */
export const AnimatedButton = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof motion.div> & { disabled?: boolean }
>(({ children, disabled, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial="rest"
      whileHover={!disabled ? 'hover' : 'rest'}
      whileTap={!disabled ? 'press' : 'rest'}
      variants={buttonPressVariants}
      {...props}
    >
      {children}
    </motion.div>
  )
})

AnimatedButton.displayName = 'AnimatedButton'

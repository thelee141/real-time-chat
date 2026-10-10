'use client'

import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { ComponentPropsWithoutRef } from "react"

import { fadeInVariants, staggerContainerVariants, staggerItemVariants } from "@/lib/animations"
import { cn } from "@/lib/utils"

function Empty({ className, ...props }: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
        className
      )}
      initial="initial"
      animate="animate"
      variants={fadeInVariants}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentPropsWithoutRef<typeof motion.div> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <motion.div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      variants={staggerItemVariants}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      variants={staggerItemVariants}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      variants={staggerItemVariants}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <motion.div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance",
        className
      )}
      variants={staggerItemVariants}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
}

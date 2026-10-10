'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

import { staggerItemVariants } from '@/lib/animations'

interface FeatureHighlightProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureHighlight({
  icon: Icon,
  title,
  description,
}: FeatureHighlightProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}

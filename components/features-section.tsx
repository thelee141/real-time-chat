'use client'

import { motion } from 'framer-motion'
import { Globe, Lock, MessageSquare, Zap } from 'lucide-react'

import { FeatureHighlight } from '@/components/feature-highlight'
import { staggerContainerVariants } from '@/lib/animations'

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to chat
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
            Powerful features to help you stay connected with friends, family, and communities.
          </p>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <FeatureHighlight
            icon={Zap}
            title="Real-time Messaging"
            description="Instant delivery for all your messages. No delays, just smooth conversation."
          />
          <FeatureHighlight
            icon={Lock}
            title="Secure & Private"
            description="Create password-protected rooms for private conversations with your team."
          />
          <FeatureHighlight
            icon={Globe}
            title="Global Access"
            description="Connect from anywhere in the world. All you need is an internet connection."
          />
          <FeatureHighlight
            icon={MessageSquare}
            title="Rich Interactions"
            description="Express yourself with emojis and seamless media sharing capabilities."
          />
        </motion.div>
      </div>
    </section>
  )
}

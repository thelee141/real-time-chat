'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: "LinaChat has completely transformed how our design team communicates. The real-time updates are a game changer.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Developer',
    content: "Simple, fast, and reliable. Exactly what I was looking for in a chat application. The dark mode is perfect.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  },
  {
    name: 'Emily Watson',
    role: 'Project Manager',
    content: "I love how easy it is to create private rooms for different projects. Keeps everything organized and secure.",
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by users
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl max-w-[700px] mx-auto">
            See what people are saying about their experience with LinaChat.
          </p>
        </div>

        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={staggerItemVariants}
              className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

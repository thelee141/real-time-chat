import { Metadata } from 'next'

import { AnimatedPage } from '@/components/animated-page'
import { FeaturesSection } from '@/components/features-section'
import { HomeHero } from '@/components/home-hero'
import { TestimonialsSection } from '@/components/testimonials-section'
import { getCurrentUser } from '@/lib/supabase/get-current-user'

// generate metadata
export const metadata: Metadata = {
  title: 'LinaChat',
  description: 'Real-time chat application',
}

// disable caching to ensure fresh data on every request
export const revalidate = 0

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <AnimatedPage>
      <div className="flex flex-col min-h-screen">
        <HomeHero user={user} />
        <FeaturesSection />
        <TestimonialsSection />
      </div>
    </AnimatedPage>
  )
}

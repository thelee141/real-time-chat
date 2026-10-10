import { ArrowLeftIcon, GhostIcon } from 'lucide-react'
import Link from 'next/link'

import { AnimatedPage } from '@/components/animated-page'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <AnimatedPage>
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-muted/30 backdrop-blur-sm ring-1 ring-border">
            <GhostIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        <h1 className="mb-2 text-8xl font-bold tracking-tighter text-primary">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Page not found
        </h2>
        <p className="mb-8 max-w-[500px] text-muted-foreground">
          Oops! It seems like you've wandered into uncharted territory. The page
          you are looking for might have been removed, had its name changed, or
          is temporarily unavailable.
        </p>

        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </AnimatedPage>
  )
}

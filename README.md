[<img width="3336" height="2256" alt="CleanShot 2025-11-10 at 16 43 11@2x" src="https://github.com/user-attachments/assets/17e0ad31-8675-40f1-bd44-096d1c76b756" />](https://real-time-chat-plum-mu.vercel.app)

# Real-Time Chat with Next.js and Supabase

This is a real-time chat application built with Next.js and Supabase.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Features](#features)
- [Database Schema](#database-schema)

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Backend:** [Supabase](https://supabase.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/)
- [Supabase Account](https://supabase.com/dashboard)

## Getting Started

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd real-time-chat
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of the project and add the following variables:

    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-supabase-anon-key
    ```

    You can get these values from your Supabase project's API settings.

### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing in a GitHub Codespace (local Supabase)

The repo ships a Supabase local project (`supabase/`) and a dev container, so
the app can run end-to-end against a local Supabase stack with no hosted
project or OAuth apps:

1. Open the repo in a Codespace (4-core / 8 GB+ recommended — the Supabase
   stack is memory-hungry).
2. The container automatically runs `npm ci`, starts the local Supabase stack
   (`supabase start`), and writes `.env.local` with the local URL/keys.
3. Run `npm run dev` and open the forwarded port 3000.
4. Sign in with the dev-only email form on the login page using a seeded
   account: `alice@example.com` or `bob@example.com` (password
   `password123`), or create any new account (email confirmation is disabled
   locally).

Useful commands (Supabase CLI is installed as a devDependency):

- `npm run db:reset` — re-run migrations + seed (wipes local data)
- `npm run gen-types:local` — regenerate `lib/supabase/types/database.ts`
  from the local stack
- `npm run db:stop` / `npm run db:start` — stop/start the stack
- Studio (browse the database): forwarded port 54323

To test the GitHub OAuth flow instead, create a GitHub OAuth app with
callback URL `https://<codespace-name>-54321.app.github.dev/auth/v1/callback`,
then enable `[auth.external.github]` in `supabase/config.toml` with the
client id/secret (use `env()` substitution) before running `supabase start`.
Port 54321 must stay publicly visible for the OAuth callback.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.

## Features

- Real-time chat rooms
- User authentication with Supabase Auth
- Create and join rooms
- Send and receive messages in real-time
- Animated UI with Framer Motion

## Database Schema

The database schema is defined in the Supabase project. The types for the schema are located in `lib/supabase/types/database.ts`.

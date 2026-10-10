#!/usr/bin/env bash
# Starts the local Supabase stack and writes .env.local with its URL/keys.
# Runs on every Codespace start; `supabase start` is a no-op when already up.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d node_modules ]; then
  echo "node_modules missing; run npm ci first." >&2
  exit 1
fi

echo "Starting local Supabase stack (first run takes a few minutes)..."
npx supabase start

# Key names in `supabase status -o env` differ across CLI versions:
# newer CLIs emit API_URL / PUBLISHABLE_KEY / SECRET_KEY,
# older ones emit SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY.
eval "$(npx supabase status -o env)"

api_url="${SUPABASE_URL:-${API_URL:-}}"
anon_key="${SUPABASE_ANON_KEY:-${ANON_KEY:-${PUBLISHABLE_KEY:-}}}"
service_key="${SUPABASE_SERVICE_ROLE_KEY:-${SERVICE_ROLE_KEY:-${SECRET_KEY:-}}}"

if [ -z "$api_url" ] || [ -z "$anon_key" ] || [ -z "$service_key" ]; then
  echo "warning: could not read URL/keys from 'supabase status'; .env.local not written" >&2
  exit 0
fi

cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=$api_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=$anon_key
SUPBASE_SECRET_KEY=$service_key
EOF

echo "Wrote .env.local pointing at the local Supabase stack."
echo "Start the app with: npm run dev"

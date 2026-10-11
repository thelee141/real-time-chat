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

# In a Codespace the user's browser is remote: 127.0.0.1 would hit their own
# machine. Point the app at the publicly forwarded API port instead (port
# 54321 is declared public in devcontainer.json). Server-side calls from
# inside the codespace loop back through GitHub's tunnel and still work.
# CODESPACE_NAME is missing in non-login shells (e.g. `gh codespace ssh`),
# so fall back to the container init environment.
codespace_name="${CODESPACE_NAME:-}"
if [ -z "$codespace_name" ] && [ -r /proc/1/environ ]; then
  codespace_name=$(tr '\0' '\n' < /proc/1/environ | sed -n 's/^CODESPACE_NAME=//p')
fi
if [ -z "$codespace_name" ] && [ -r /etc/environment ]; then
  codespace_name=$(sed -n 's/^CODESPACE_NAME=//p' /etc/environment)
fi
if [ -n "$codespace_name" ]; then
  api_url="https://${codespace_name}-54321.app.github.dev"
  echo "Codespace detected: using public API URL $api_url"
fi

cat > .env.local <<EOF
NEXT_PUBLIC_SUPABASE_URL=$api_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=$anon_key
SUPBASE_SECRET_KEY=$service_key
EOF

echo "Wrote .env.local pointing at the local Supabase stack."
echo "Start the app with: npm run dev"

-- Presence/broadcast on private channels inserts into realtime.messages on
-- the user's behalf, so authenticated subscribers also need INSERT access
-- (SELECT is granted by the policy in 20261010120002_create_rls_policies).

create policy "authenticated_users_can_send_on_private_channels"
  on realtime.messages
  for insert
  to authenticated
  with check (true);

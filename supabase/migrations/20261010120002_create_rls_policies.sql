-- RLS policies for the browser (anon key) client. The server actions use the
-- service-role admin client, which bypasses RLS and re-checks auth/membership
-- in code; these policies only gate direct browser access.

alter table public.user_profile enable row level security;
alter table public.chat_room enable row level security;
alter table public.chat_room_member enable row level security;
alter table public.messages enable row level security;

-- Profiles are readable by any authenticated user (message author joins).
create policy "profiles_select_authenticated"
  on public.user_profile
  for select
  to authenticated
  using (true);

-- Rooms are readable when public or when the user is a member
-- (keeps password hashes of private rooms away from non-members).
create policy "rooms_select_authenticated"
  on public.chat_room
  for select
  to authenticated
  using (
    is_public
    or exists (
      select 1 from public.chat_room_member m
      where m.chat_room_id = chat_room.id
        and m.member_id = (select auth.uid())
    )
  );

-- Users can see their own memberships. This also backs the messages policy
-- subquery, which runs with the invoking user's permissions.
create policy "memberships_select_own"
  on public.chat_room_member
  for select
  to authenticated
  using ((select auth.uid()) = member_id);

-- Users can join public rooms themselves (private rooms go through the
-- verifyPasswordAndJoinRoom server action).
create policy "memberships_insert_own_public_rooms"
  on public.chat_room_member
  for insert
  to authenticated
  with check (
    (select auth.uid()) = member_id
    and exists (
      select 1 from public.chat_room r
      where r.id = chat_room_id
        and r.is_public
    )
  );

-- Users can leave rooms (delete their own membership).
create policy "memberships_delete_own"
  on public.chat_room_member
  for delete
  to authenticated
  using ((select auth.uid()) = member_id);

-- Messages are readable by room members. Realtime also uses this policy to
-- authorize postgres_changes delivery on the private room channel.
create policy "messages_select_members"
  on public.messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_room_member m
      where m.chat_room_id = messages.chat_room_id
        and m.member_id = (select auth.uid())
    )
  );

-- The room channel (room:<roomId>:messages) is private, so Realtime
-- Authorization checks SELECT on realtime.messages for subscribers.
create policy "authenticated_users_can_subscribe_to_private_channels"
  on realtime.messages
  for select
  to authenticated
  using (true);

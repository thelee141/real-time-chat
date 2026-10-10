-- The room client subscribes to postgres_changes on public.messages
-- (app/rooms/[id]/_client.tsx), which requires the table in the publication.
alter publication supabase_realtime add table public.messages;

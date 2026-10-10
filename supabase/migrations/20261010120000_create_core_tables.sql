-- Core tables for the real-time chat app.
-- Mirrors the schema of the hosted Supabase project as captured in
-- lib/supabase/types/database.ts so generated types stay compatible.

create table if not exists public.user_profile (
  id uuid primary key default gen_random_uuid() references auth.users (id) on delete cascade,
  name text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_room (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_public boolean not null,
  password_hash text,
  invite_code text not null,
  code_regenerated_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index chat_room_invite_code_key on public.chat_room (invite_code);

create table if not exists public.chat_room_member (
  chat_room_id uuid not null references public.chat_room (id) on delete cascade,
  member_id uuid not null references public.user_profile (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (chat_room_id, member_id)
);

create index chat_room_member_member_id_idx on public.chat_room_member (member_id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  chat_room_id uuid not null references public.chat_room (id) on delete cascade,
  author_id uuid not null references public.user_profile (id) on delete cascade,
  author_name text,
  author_image_url text,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  edited_at timestamptz
);

create index messages_chat_room_id_idx on public.messages (chat_room_id);
create index messages_author_id_idx on public.messages (author_id);
create index messages_chat_room_created_at_idx on public.messages (chat_room_id, created_at desc);

-- Triggers that the app depends on:
-- 1. A user_profile row is created for every new auth user (the app never
--    inserts profiles itself, including on OAuth sign-up).
-- 2. Messages are enriched with denormalized author name/image so the
--    postgres_changes INSERT payload contains author info for realtime
--    subscribers (see app/rooms/[id]/_client.tsx).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profile (id, name, image_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      nullif(new.raw_user_meta_data ->> 'user_name', ''),
      nullif(new.email, ''),
      'user'
    ),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_message_author()
returns trigger
language plpgsql
set search_path = 'public'
as $$
declare
  profile record;
begin
  select name, image_url
  into profile
  from public.user_profile
  where id = new.author_id;

  new.author_name := profile.name;
  new.author_image_url := profile.image_url;

  return new;
end;
$$;

create trigger set_message_author_before_insert
  before insert on public.messages
  for each row execute function public.set_message_author();

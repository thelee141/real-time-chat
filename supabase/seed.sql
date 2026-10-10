-- Demo data for local testing. Runs after migrations on `supabase db reset`
-- and on first `supabase start`.
--
-- Demo accounts (email login is dev-only UI; password for both: password123):
--   alice@example.com / bob@example.com
--
-- The *token columns must be non-null empty strings: gotrue fails to scan
-- NULL confirmation/recovery/email-change tokens on sign-in (HTTP 500).

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_current,
  email_change_token_new,
  email_change,
  created_at,
  updated_at,
  last_sign_in_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'alice@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Alice"}'::jsonb,
    '',
    now(),
    '',
    now(),
    '',
    '',
    '',
    now(),
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Bob"}'::jsonb,
    '',
    now(),
    '',
    now(),
    '',
    '',
    '',
    now(),
    now(),
    now()
  );

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    jsonb_build_object(
      'sub', '00000000-0000-0000-0000-000000000001',
      'email', 'alice@example.com',
      'email_verified', true
    ),
    'email',
    '00000000-0000-0000-0000-000000000001',
    now(),
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    jsonb_build_object(
      'sub', '00000000-0000-0000-0000-000000000002',
      'email', 'bob@example.com',
      'email_verified', true
    ),
    'email',
    '00000000-0000-0000-0000-000000000002',
    now(),
    now(),
    now()
  );

-- user_profile rows are created by the on_auth_user_created trigger.

insert into public.chat_room (id, name, is_public, invite_code)
values ('00000000-0000-0000-0000-0000000000a1', 'General', true, 'demoroom001');

insert into public.chat_room_member (chat_room_id, member_id)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000002');

-- author_name / author_image_url are filled by the set_message_author trigger.
insert into public.messages (text, chat_room_id, author_id)
values
  ('Welcome to the demo room!', '00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000001'),
  ('Hey Alice, this is Bob. The local stack works!', '00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000002');

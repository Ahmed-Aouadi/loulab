-- Loulab foundation schema for Supabase (PostgreSQL)
create extension if not exists pgcrypto;

create table if not exists public.guardian_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  birth_year smallint,
  avatar text not null default '🧒',
  created_at timestamptz not null default now()
);

create table if not exists public.learning_content (
  id text primary key,
  title text not null,
  category text not null,
  description text not null default '',
  published boolean not null default false,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  content_id text not null references public.learning_content(id) on delete cascade,
  current_page integer not null default 0 check (current_page >= 0),
  completed boolean not null default false,
  stars integer not null default 0 check (stars >= 0),
  updated_at timestamptz not null default now(),
  unique(student_id, content_id)
);

create table if not exists public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  activity_id text not null,
  score integer not null default 0 check (score >= 0),
  total integer not null default 0 check (total >= 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.student_achievements (
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key(student_id, achievement_id)
);

create index if not exists student_profiles_guardian_idx on public.student_profiles(guardian_id);
create index if not exists student_progress_student_idx on public.student_progress(student_id);
create index if not exists activity_attempts_student_date_idx on public.activity_attempts(student_id, created_at desc);

alter table public.guardian_profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.learning_content enable row level security;
alter table public.student_progress enable row level security;
alter table public.activity_attempts enable row level security;
alter table public.student_achievements enable row level security;

create policy "guardian manages own profile" on public.guardian_profiles
 for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "guardian manages own students" on public.student_profiles
 for all using (auth.uid() = guardian_id) with check (auth.uid() = guardian_id);

create policy "published learning content is readable" on public.learning_content
 for select using (published = true);

create policy "guardian reads student progress" on public.student_progress
 for all using (exists (select 1 from public.student_profiles s where s.id = student_id and s.guardian_id = auth.uid()))
 with check (exists (select 1 from public.student_profiles s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian reads student attempts" on public.activity_attempts
 for all using (exists (select 1 from public.student_profiles s where s.id = student_id and s.guardian_id = auth.uid()))
 with check (exists (select 1 from public.student_profiles s where s.id = student_id and s.guardian_id = auth.uid()));

create policy "guardian reads student achievements" on public.student_achievements
 for all using (exists (select 1 from public.student_profiles s where s.id = student_id and s.guardian_id = auth.uid()))
 with check (exists (select 1 from public.student_profiles s where s.id = student_id and s.guardian_id = auth.uid()));

-- Never expose the Supabase service-role key in browser code.

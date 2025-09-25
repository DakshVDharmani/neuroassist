-- Enable extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Function to update 'updated_at' column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1. profiles: Extends auth.users with public data
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('patient', 'psychologist', 'admin')),
  display_name text,
  contact_email text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = user_id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger on_profiles_update before update on public.profiles for each row execute procedure public.handle_updated_at();

-- 2. patient_profiles: Detailed, private patient info
create table if not exists public.patient_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  age int,
  gender text,
  weight_kg numeric,
  height_cm numeric,
  medical_history text,
  current_medications text,
  therapy_goals text,
  disorders text[]
);
alter table public.patient_profiles enable row level security;
create policy "Patients can manage their own profile." on public.patient_profiles for all using (auth.uid() = user_id);
create policy "Connected clinicians can view patient profiles." on public.patient_profiles for select using (
  exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);

-- 3. psychologist_profiles: Detailed clinician info
create table if not exists public.psychologist_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  bio text,
  specialty text[],
  license_number text,
  years_experience int,
  charges_per_hour numeric,
  availability jsonb
);
alter table public.psychologist_profiles enable row level security;
create policy "Clinicians can manage their own profile." on public.psychologist_profiles for all using (auth.uid() = user_id);
create policy "Authenticated users can view clinician profiles." on public.psychologist_profiles for select using (auth.role() = 'authenticated');

-- 4. connections: Links patients and clinicians
create table if not exists public.connections (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references public.profiles(user_id) on delete cascade,
  psychologist_id uuid not null references public.profiles(user_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now(),
  unique(patient_id, psychologist_id)
);
alter table public.connections enable row level security;
create policy "Users can manage their own connections." on public.connections for all using (auth.uid() = patient_id or auth.uid() = psychologist_id);

-- 5. assessments: Self-report questionnaire submissions
create table if not exists public.assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  assessment_type text not null, -- e.g., 'phq-9', 'gad-7'
  scores jsonb not null,
  ai_summary jsonb,
  created_at timestamptz default now()
);
alter table public.assessments enable row level security;
create policy "Users can manage their own assessments." on public.assessments for all using (auth.uid() = user_id);
create policy "Connected clinicians can view patient assessments." on public.assessments for select using (
  exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);

-- 6. games: Metadata for cognitive games
create table if not exists public.games (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text
);
-- Seed games
insert into public.games (slug, name, description) values
('attention-catch', 'Attention Catch', 'React to targets to measure sustained attention.'),
('n-back', 'N-Back', 'Test working memory by matching stimuli from N steps ago.'),
('go-no-go', 'Go/No-Go', 'Measure response inhibition.')
on conflict (slug) do nothing;

-- 7. game_attempts: Records of each game played
create table if not exists public.game_attempts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  game_slug text not null references public.games(slug),
  score int not null,
  metadata jsonb, -- e.g., { reaction_time: 250, accuracy: 0.95 }
  created_at timestamptz default now()
);
alter table public.game_attempts enable row level security;
create policy "Users can manage their own game attempts." on public.game_attempts for all using (auth.uid() = user_id);
create policy "Connected clinicians can view patient game attempts." on public.game_attempts for select using (
  exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);

-- 8. observations: Passively collected behavioral data
create table if not exists public.observations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  session_id uuid, -- Optional link to a specific session/game
  type text not null, -- e.g., 'gaze', 'head_pose', 'vocal_tone'
  timestamp timestamptz not null default now(),
  data jsonb not null -- e.g., { gaze_on_screen: 0.8, pitch: 150 }
);
alter table public.observations enable row level security;
create policy "Users can insert their own observations." on public.observations for insert with check (auth.uid() = user_id);
create policy "Connected clinicians can view patient observations." on public.observations for select using (
  exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);

-- 9. alerts: Automated safety or progress flags
create table if not exists public.alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  level text not null check (level in ('low', 'medium', 'high')),
  reason text not null,
  observation_id uuid references public.observations(id),
  resolved boolean default false,
  resolved_by uuid references public.profiles(user_id),
  created_at timestamptz default now()
);
alter table public.alerts enable row level security;
create policy "Clinicians can manage alerts for their patients." on public.alerts for all using (
  exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);
create policy "Patients can view their own alerts." on public.alerts for select using (auth.uid() = user_id);

-- 10. messages: Secure messaging
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  from_user uuid not null references public.profiles(user_id),
  to_user uuid not null references public.profiles(user_id),
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);
alter table public.messages enable row level security;
create policy "Users can send and receive their own messages." on public.messages for all using (auth.uid() = from_user or auth.uid() = to_user);

-- 11. clinician_notes: Private notes by clinicians about patients
create table if not exists public.clinician_notes (
  id uuid primary key default uuid_generate_v4(),
  clinician_id uuid not null references public.profiles(user_id),
  patient_id uuid not null references public.profiles(user_id),
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.clinician_notes enable row level security;
create policy "Clinicians can manage notes for their own patients." on public.clinician_notes for all using (auth.uid() = clinician_id and exists (select 1 from public.connections where patient_id = patient_id and psychologist_id = auth.uid() and status = 'accepted'));
create trigger on_clinician_notes_update before update on public.clinician_notes for each row execute procedure public.handle_updated_at();

-- 12. treatment_plans & items
create table if not exists public.treatment_plans (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references public.profiles(user_id),
  clinician_id uuid not null references public.profiles(user_id),
  title text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.treatment_plans enable row level security;
create policy "Users can view their own treatment plans." on public.treatment_plans for select using (auth.uid() = patient_id or auth.uid() = clinician_id);
create policy "Clinicians can create plans for their patients." on public.treatment_plans for insert with check (auth.uid() = clinician_id and exists (select 1 from public.connections where patient_id = patient_id and psychologist_id = auth.uid() and status = 'accepted'));

create table if not exists public.treatment_plan_items (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.treatment_plans(id) on delete cascade,
  item_type text not null, -- e.g., 'assessment', 'game', 'resource', 'journal'
  item_id text, -- slug or id of the item
  instructions text,
  due_date date,
  completed boolean default false,
  completed_at timestamptz
);
alter table public.treatment_plan_items enable row level security;
create policy "Users can view items on their own treatment plans." on public.treatment_plan_items for select using (
  exists (select 1 from public.treatment_plans where id = plan_id and (patient_id = auth.uid() or clinician_id = auth.uid()))
);
create policy "Users can update their own plan items (e.g., mark complete)." on public.treatment_plan_items for update using (
  exists (select 1 from public.treatment_plans where id = plan_id and patient_id = auth.uid())
);

-- 13. journal_entries
create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  content text not null,
  mood_rating int check (mood_rating between 1 and 10),
  sentiment_analysis jsonb,
  is_shared boolean default false,
  created_at timestamptz default now()
);
alter table public.journal_entries enable row level security;
create policy "Users can manage their own journal entries." on public.journal_entries for all using (auth.uid() = user_id);
create policy "Clinicians can view shared journal entries." on public.journal_entries for select using (
  is_shared = true and exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);

-- 14. habit_trackers & entries
create table if not exists public.habit_trackers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  name text not null,
  description text,
  goal int,
  unit text, -- e.g., 'minutes', 'steps', 'times'
  created_at timestamptz default now()
);
alter table public.habit_trackers enable row level security;
create policy "Users can manage their own habit trackers." on public.habit_trackers for all using (auth.uid() = user_id);

create table if not exists public.habit_entries (
  id uuid primary key default uuid_generate_v4(),
  tracker_id uuid not null references public.habit_trackers(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  value numeric not null,
  entry_date date not null default current_date,
  unique(tracker_id, entry_date)
);
alter table public.habit_entries enable row level security;
create policy "Users can manage their own habit entries." on public.habit_entries for all using (auth.uid() = user_id);

-- 15. resources
create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type text not null, -- 'article', 'video', 'audio'
  url text,
  content text,
  tags text[]
);
alter table public.resources enable row level security;
create policy "Authenticated users can view resources." on public.resources for select using (auth.role() = 'authenticated');
create policy "Admins can manage resources." on public.resources for all using (exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin'));

-- 16. achievements & user_achievements
create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  icon text
);
alter table public.achievements enable row level security;
create policy "Authenticated users can view achievements." on public.achievements for select using (auth.role() = 'authenticated');
-- Seed achievements
insert into public.achievements (slug, name, description, icon) values
('first-game', 'First Step', 'Completed your first cognitive game.', 'Gamepad2'),
('7-day-streak', 'Consistent Mind', 'Completed a task 7 days in a row.', 'Flame')
on conflict (slug) do nothing;

create table if not exists public.user_achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  achievement_slug text not null references public.achievements(slug),
  created_at timestamptz default now(),
  unique(user_id, achievement_slug)
);
alter table public.user_achievements enable row level security;
create policy "Users can view their own achievements." on public.user_achievements for select using (auth.uid() = user_id);

-- 17. audit_logs
create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(user_id),
  action text not null,
  resource_id text,
  resource_type text,
  details jsonb,
  created_at timestamptz default now()
);
alter table public.audit_logs enable row level security;
create policy "Admins can view audit logs." on public.audit_logs for select using (exists (select 1 from public.profiles where user_id = auth.uid() and role = 'admin'));

-- 18. group_sessions & participants
create table if not exists public.group_sessions (
  id uuid primary key default uuid_generate_v4(),
  clinician_id uuid not null references public.profiles(user_id),
  title text not null,
  description text,
  scheduled_at timestamptz not null,
  duration_minutes int not null,
  meeting_url text
);
alter table public.group_sessions enable row level security;
create policy "Authenticated users can view group sessions." on public.group_sessions for select using (auth.role() = 'authenticated');
create policy "Clinicians can manage their own group sessions." on public.group_sessions for all using (auth.uid() = clinician_id);

create table if not exists public.group_session_participants (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.group_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  unique(session_id, user_id)
);
alter table public.group_session_participants enable row level security;
create policy "Users can manage their own participation." on public.group_session_participants for all using (auth.uid() = user_id);
create policy "Clinicians can view participants of their sessions." on public.group_session_participants for select using (
  exists (select 1 from public.group_sessions where id = session_id and clinician_id = auth.uid())
);

-- 19. community_posts & comments
create table if not exists public.community_posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(user_id),
  title text not null,
  content text not null,
  tags text[],
  created_at timestamptz default now()
);
alter table public.community_posts enable row level security;
create policy "Authenticated users can view posts." on public.community_posts for select using (auth.role() = 'authenticated');
create policy "Users can manage their own posts." on public.community_posts for all using (auth.uid() = author_id);

create table if not exists public.community_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(user_id),
  content text not null,
  created_at timestamptz default now()
);
alter table public.community_comments enable row level security;
create policy "Authenticated users can view comments." on public.community_comments for select using (auth.role() = 'authenticated');
create policy "Users can manage their own comments." on public.community_comments for all using (auth.uid() = author_id);

-- 20. recordings metadata
create table if not exists public.recordings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(user_id),
  session_id uuid, -- link to a game or therapy session
  storage_path text not null, -- path in Supabase storage
  file_type text, -- e.g., 'video/webm', 'audio/wav'
  duration_seconds int,
  created_at timestamptz default now()
);
alter table public.recordings enable row level security;
create policy "Users can manage their own recordings." on public.recordings for all using (auth.uid() = user_id);
create policy "Connected clinicians can view patient recordings." on public.recordings for select using (
  exists (select 1 from public.connections where patient_id = user_id and psychologist_id = auth.uid() and status = 'accepted')
);

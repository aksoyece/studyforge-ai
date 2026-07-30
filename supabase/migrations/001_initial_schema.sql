create table cv_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_title text, job_description text, cv_text text,
  analysis_result jsonb, ai_provider text,
  created_at timestamptz default now()
);

create table quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  pdf_name text, questions jsonb, ai_provider text,
  created_at timestamptz default now()
);

create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  session_id uuid references quiz_sessions on delete cascade not null,
  score integer, total integer, answers jsonb,
  completed_at timestamptz default now()
);

-- Enable RLS
alter table cv_analyses enable row level security;
alter table quiz_sessions enable row level security;
alter table quiz_results enable row level security;

-- Policies for CV Analyses
create policy "Kullanıcılar kendi CV analizlerini görebilir" on cv_analyses
  for select using (auth.uid() = user_id);
create policy "Kullanıcılar CV analizi oluşturabilir" on cv_analyses
  for insert with check (auth.uid() = user_id);

-- Policies for Quiz Sessions
create policy "Kullanıcılar kendi quiz seanslarını görebilir" on quiz_sessions
  for select using (auth.uid() = user_id);
create policy "Kullanıcılar quiz seansı oluşturabilir" on quiz_sessions
  for insert with check (auth.uid() = user_id);

-- Policies for Quiz Results
create policy "Kullanıcılar kendi quiz sonuçlarını görebilir" on quiz_results
  for select using (auth.uid() = user_id);
create policy "Kullanıcılar quiz sonucu oluşturabilir" on quiz_results
  for insert with check (auth.uid() = user_id);

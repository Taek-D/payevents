-- PayEvents DB Schema
-- Supabase SQL Editor에서 실행

-- 확장
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUM 타입
-- ============================================================

do $$ begin
  create type event_status as enum ('draft', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type source_type as enum ('official', 'community', 'submission', 'crawled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type submission_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

-- ============================================================
-- 1. payment_providers — 결제사
-- ============================================================

create table if not exists payment_providers (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name_ko     text not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_payment_providers_code on payment_providers (code);
create index if not exists idx_payment_providers_sort on payment_providers (sort_order);

-- ============================================================
-- 2. categories — 카테고리
-- ============================================================

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name_ko     text not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_categories_slug on categories (slug);
create index if not exists idx_categories_sort on categories (sort_order);

-- ============================================================
-- 3. brands — 브랜드
-- ============================================================

create table if not exists brands (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name_ko         text not null,
  normalized_name text not null,
  website_url     text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_brands_slug on brands (slug);
create index if not exists idx_brands_normalized on brands (normalized_name);

-- ============================================================
-- 4. events — 이벤트
-- ============================================================

create table if not exists events (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  title               text not null,
  summary             text,
  payment_provider_id uuid not null references payment_providers (id),
  category_id         uuid not null references categories (id),
  brand_id            uuid not null references brands (id),
  benefit_text        text not null,
  condition_text      text,
  max_benefit_value   integer,
  stacking_possible   boolean not null default false,
  start_date          date not null,
  end_date            date not null,
  is_online           boolean not null default true,
  is_offline          boolean not null default false,
  region_limit        text,
  source_url          text,
  source_type         source_type not null default 'official',
  is_verified         boolean not null default false,
  status              event_status not null default 'draft',
  priority            integer not null default 0,
  view_count          integer not null default 0,
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint chk_events_dates check (end_date >= start_date)
);

create index if not exists idx_events_slug on events (slug);
create index if not exists idx_events_status on events (status);
create index if not exists idx_events_provider on events (payment_provider_id);
create index if not exists idx_events_category on events (category_id);
create index if not exists idx_events_brand on events (brand_id);
create index if not exists idx_events_dates on events (start_date, end_date);
create index if not exists idx_events_published on events (status, published_at desc)
  where status = 'published';

-- ============================================================
-- 5. newsletter_subscribers — 뉴스레터 구독자
-- ============================================================

create table if not exists newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  is_active       boolean not null default true,
  source          text not null default 'website',
  subscribed_at   timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists idx_newsletter_email on newsletter_subscribers (email);
create index if not exists idx_newsletter_active on newsletter_subscribers (is_active)
  where is_active = true;

-- ============================================================
-- 6. event_submissions — 이벤트 제보
-- ============================================================

create table if not exists event_submissions (
  id                    uuid primary key default gen_random_uuid(),
  submitter_name        text,
  submitter_email       text,
  payment_provider_code text not null,
  brand_name            text not null,
  category_slug         text not null,
  title                 text not null,
  summary               text,
  benefit_text          text not null,
  condition_text        text,
  source_url            text,
  screenshot_url        text,
  start_date            date,
  end_date              date,
  status                submission_status not null default 'pending',
  admin_note            text,
  approved_event_id     uuid references events (id),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_submissions_status on event_submissions (status);
create index if not exists idx_submissions_created on event_submissions (created_at desc);

-- ============================================================
-- RLS 정책
-- ============================================================

alter table event_submissions enable row level security;

do $$ begin
  create policy "Anyone can submit events"
    on event_submissions for insert
    to anon, authenticated
    with check (true);
exception when duplicate_object then null;
end $$;

-- ============================================================
-- updated_at 자동 갱신 트리거
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger trg_payment_providers_updated
    before update on payment_providers
    for each row execute function update_updated_at();
exception when duplicate_object then null;
end $$;

do $$ begin
  create trigger trg_categories_updated
    before update on categories
    for each row execute function update_updated_at();
exception when duplicate_object then null;
end $$;

do $$ begin
  create trigger trg_brands_updated
    before update on brands
    for each row execute function update_updated_at();
exception when duplicate_object then null;
end $$;

do $$ begin
  create trigger trg_events_updated
    before update on events
    for each row execute function update_updated_at();
exception when duplicate_object then null;
end $$;

do $$ begin
  create trigger trg_submissions_updated
    before update on event_submissions
    for each row execute function update_updated_at();
exception when duplicate_object then null;
end $$;

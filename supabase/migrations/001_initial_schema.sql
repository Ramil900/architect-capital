-- ============================================================
-- 001_initial_schema.sql
-- Architect Capital — initial database schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- assets
-- Reference table, shared across all users (no RLS)
-- ============================================================
create table if not exists assets (
  id             uuid primary key default uuid_generate_v4(),
  ticker         text not null unique,
  name           text not null,
  category       text not null check (category in ('ETF', 'Stocks', 'Crypto', 'Metals')),
  color          text not null,
  target_percent numeric(5,2) not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_assets_ticker on assets (ticker);

-- ============================================================
-- portfolio_positions
-- Per-user holdings
-- ============================================================
create table if not exists portfolio_positions (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references auth.users (id) on delete cascade,
  asset_id              uuid not null references assets (id) on delete restrict,
  ticker                text not null,
  quantity              numeric(20,8) not null default 0,
  average_price         numeric(20,8) not null default 0,
  current_price         numeric(20,8) not null default 0,
  target_percent        numeric(5,2) not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id, ticker)
);

create index if not exists idx_portfolio_positions_user_id on portfolio_positions (user_id);
create index if not exists idx_portfolio_positions_ticker  on portfolio_positions (ticker);

-- ============================================================
-- market_prices
-- Latest price snapshots (shared, no RLS)
-- ============================================================
create table if not exists market_prices (
  id          uuid primary key default uuid_generate_v4(),
  ticker      text not null,
  price       numeric(20,8) not null,
  source      text not null default 'demo',
  recorded_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

create index if not exists idx_market_prices_ticker      on market_prices (ticker);
create index if not exists idx_market_prices_recorded_at on market_prices (recorded_at desc);

-- ============================================================
-- market_indicators
-- Market regime / indicator snapshots (shared, no RLS)
-- ============================================================
create table if not exists market_indicators (
  id               uuid primary key default uuid_generate_v4(),
  symbol           text not null,
  name             text not null,
  value            numeric(20,8) not null,
  display_value    text not null,
  daily_change     numeric(20,8) not null default 0,
  daily_change_pct numeric(10,4) not null default 0,
  weekly_change    numeric(20,8) not null default 0,
  weekly_change_pct numeric(10,4) not null default 0,
  status           text not null check (status in ('Normal', 'Caution', 'Danger')),
  category         text not null,
  interpretation   text not null default '',
  recorded_at      timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

create index if not exists idx_market_indicators_symbol      on market_indicators (symbol);
create index if not exists idx_market_indicators_recorded_at on market_indicators (recorded_at desc);

-- ============================================================
-- strategy_settings
-- Per-user investment strategy config
-- ============================================================
create table if not exists strategy_settings (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null unique references auth.users (id) on delete cascade,
  risk_profile          text not null default 'Moderate' check (risk_profile in ('Conservative', 'Moderate', 'Aggressive')),
  investment_horizon    text not null default 'Long' check (investment_horizon in ('Short', 'Medium', 'Long')),
  max_drawdown          numeric(5,2) not null default 30,
  cash_reserve_percent  numeric(5,2) not null default 10,
  dca_enabled           boolean not null default true,
  dca_amount            numeric(12,2) not null default 500,
  dca_frequency         text not null default 'Weekly',
  leverage              numeric(4,2) not null default 0,
  rebalance_threshold   numeric(4,2) not null default 5,
  ai_mode               text not null default 'Balanced' check (ai_mode in ('Conservative', 'Balanced', 'Aggressive')),
  base_currency         text not null default 'USD',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists idx_strategy_settings_user_id on strategy_settings (user_id);

-- ============================================================
-- ai_reports
-- Per-user AI analysis snapshots
-- ============================================================
create table if not exists ai_reports (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  market_regime    text not null,
  portfolio_risk   text not null,
  risk_score       integer not null,
  confidence       integer not null,
  final_summary    text not null,
  recommendations  jsonb not null default '[]',
  risk_factors     jsonb not null default '[]',
  dca_status       text not null,
  dca_amount       numeric(12,2),
  dca_frequency    text,
  dca_allocation   jsonb not null default '[]',
  created_at       timestamptz not null default now()
);

create index if not exists idx_ai_reports_user_id    on ai_reports (user_id);
create index if not exists idx_ai_reports_created_at on ai_reports (created_at desc);

-- ============================================================
-- rebalance_history
-- Per-user rebalancing actions log
-- ============================================================
create table if not exists rebalance_history (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  ticker         text not null,
  action         text not null check (action in ('Buy', 'Sell', 'Reduce', 'Hold')),
  diff_percent   numeric(8,4) not null,
  diff_value     numeric(14,2) not null,
  priority       text not null check (priority in ('High', 'Medium', 'Low')),
  executed       boolean not null default false,
  executed_at    timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_rebalance_history_user_id    on rebalance_history (user_id);
create index if not exists idx_rebalance_history_ticker     on rebalance_history (ticker);
create index if not exists idx_rebalance_history_created_at on rebalance_history (created_at desc);

-- ============================================================
-- dca_history
-- Per-user DCA execution log
-- ============================================================
create table if not exists dca_history (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  ticker       text not null,
  dca_level    text not null,
  amount       numeric(12,2) not null,
  price        numeric(20,8) not null,
  market_drop  numeric(6,2) not null,
  status       text not null default 'Executed' check (status in ('Executed', 'Skipped', 'Pending')),
  executed_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists idx_dca_history_user_id    on dca_history (user_id);
create index if not exists idx_dca_history_ticker     on dca_history (ticker);
create index if not exists idx_dca_history_created_at on dca_history (created_at desc);

-- ============================================================
-- notifications
-- Per-user in-app notifications
-- ============================================================
create table if not exists notifications (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null,
  title      text not null,
  body       text not null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id    on notifications (user_id);
create index if not exists idx_notifications_created_at on notifications (created_at desc);
create index if not exists idx_notifications_is_read    on notifications (user_id, is_read);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table portfolio_positions  enable row level security;
alter table strategy_settings    enable row level security;
alter table ai_reports           enable row level security;
alter table rebalance_history    enable row level security;
alter table dca_history          enable row level security;
alter table notifications        enable row level security;

-- portfolio_positions policies
create policy "users_own_portfolio_positions"
  on portfolio_positions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- strategy_settings policies
create policy "users_own_strategy_settings"
  on strategy_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ai_reports policies
create policy "users_own_ai_reports"
  on ai_reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- rebalance_history policies
create policy "users_own_rebalance_history"
  on rebalance_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- dca_history policies
create policy "users_own_dca_history"
  on dca_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- notifications policies
create policy "users_own_notifications"
  on notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_assets_updated_at
  before update on assets
  for each row execute function set_updated_at();

create trigger trg_portfolio_positions_updated_at
  before update on portfolio_positions
  for each row execute function set_updated_at();

create trigger trg_strategy_settings_updated_at
  before update on strategy_settings
  for each row execute function set_updated_at();

-- ============================================================
-- Seed — assets
-- ============================================================
insert into assets (ticker, name, category, color, target_percent) values
  ('VOO',   'Vanguard S&P 500 ETF',      'ETF',    '#3b82f6', 20),
  ('QQQ',   'Invesco QQQ Trust',          'ETF',    '#6366f1', 15),
  ('SOXX',  'iShares Semiconductor ETF',  'ETF',    '#8b5cf6', 10),
  ('SMH',   'VanEck Semiconductor ETF',   'ETF',    '#a855f7', 10),
  ('GLD',   'SPDR Gold Trust',            'Metals', '#f59e0b', 10),
  ('SLV',   'iShares Silver Trust',       'Metals', '#94a3b8', 10),
  ('BTC',   'Bitcoin',                    'Crypto', '#f97316',  7),
  ('ETH',   'Ethereum',                   'Crypto', '#06b6d4',  3),
  ('BRK.B', 'Berkshire Hathaway B',       'Stocks', '#22c55e', 10),
  ('TSLA',  'Tesla Inc.',                  'Stocks', '#ef4444',  5)
on conflict (ticker) do nothing;

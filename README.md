# Архитектор Капитала

Institutional-grade AI investment dashboard for long-term portfolio management. Bloomberg × Apple × BlackRock aesthetic — dark graphite fintech UI built for serious investors.

## Features

- **AI Strategy** — GPT-4o-mini portfolio analysis with risk-adjusted recommendations
- **Portfolio Management** — position tracking, allocation monitoring, P&L analytics
- **Market Indicators** — VIX, S&P 500, bonds, USD index with regime detection
- **DCA Planner** — dollar-cost averaging buy zones, cash deployment tracking
- **Rebalancing** — current vs target allocation, priority action queue
- **Reports** — PDF / CSV / Excel export, AI executive summary
- **Notifications** — in-app alerts for rebalance signals and DCA triggers
- **Settings** — strategy, risk, DCA, AI, currency, notification preferences

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth & DB | Supabase (PostgreSQL + Auth + RLS) |
| AI | OpenAI GPT-4o-mini |
| Charts | Recharts |
| PDF Export | jsPDF |
| Excel Export | xlsx |
| Market APIs | Twelvedata · Finnhub · CoinGecko (optional) |
| Deployment | Vercel |

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
git clone https://github.com/your-org/architect-capital.git
cd architect-capital
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key (admin operations) |
| `OPENAI_API_KEY` | No | OpenAI API key — enables real AI analysis |
| `TWELVEDATA_API_KEY` | No | Twelvedata API — live stock prices |
| `FINNHUB_API_KEY` | No | Finnhub API — market indicators |
| `COINGECKO_API_KEY` | No | CoinGecko API — crypto prices |
| `BINANCE_API_KEY` | No | Binance API — crypto exchange data |
| `MARKET_SYNC_SECRET` | No | Secret header for `POST /api/market/sync` |
| `NEXT_PUBLIC_APP_URL` | No | Production URL (e.g. `https://app.example.com`) |
| `NEXT_PUBLIC_APP_NAME` | No | App display name override |

> All external API keys are optional. The app falls back to Supabase data, then demo data when keys are missing — the UI always renders.

## Supabase Schema

Create the following tables via the Supabase SQL editor:

```sql
-- User settings
create table strategy_settings (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null unique,
  settings   jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- DCA history
create table dca_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  ticker      text, dca_level text, amount numeric,
  price       numeric, market_drop numeric,
  status      text default 'Executed',
  executed_at timestamptz default now()
);

-- Rebalancing history
create table rebalance_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  ticker      text, action text, diff_percent numeric,
  diff_value  numeric, priority text,
  executed    boolean default false,
  executed_at timestamptz,
  created_at  timestamptz default now()
);

-- AI reports
create table ai_reports (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null,
  type         text, title text, description text,
  status       text default 'Generated',
  size         text,
  generated_at timestamptz default now()
);

-- Notifications
create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  type       text, title text, message text,
  read       boolean default false,
  created_at timestamptz default now()
);

-- Market data (optional — used by market sync)
create table market_prices (
  ticker      text primary key,
  price       numeric not null,
  recorded_at timestamptz default now()
);

create table market_indicators (
  symbol           text primary key,
  name             text, value numeric, display_value text,
  daily_change     numeric, daily_change_pct numeric,
  weekly_change    numeric, weekly_change_pct numeric,
  status           text, category text, interpretation text,
  recorded_at      timestamptz default now()
);
```

Enable Row Level Security on all user tables:

```sql
alter table strategy_settings  enable row level security;
alter table dca_history         enable row level security;
alter table rebalance_history   enable row level security;
alter table ai_reports          enable row level security;
alter table notifications       enable row level security;

-- Example policy (repeat for each table)
create policy "Users own their data"
  on strategy_settings for all using (auth.uid() = user_id);
```

## Development Workflow

```bash
npm run dev      # Start dev server with Turbopack hot reload
npm run build    # Production build + TypeScript type check
npm run start    # Start production server locally
npm run lint     # ESLint
```

## Deployment (Vercel)

1. Push repo to GitHub
2. Import in [Vercel dashboard](https://vercel.com/new)
3. Add environment variables under **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js, no `vercel.json` needed

### Minimum Required Variables on Vercel

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Supabase Auth Callback URL

In **Supabase → Authentication → URL Configuration**, add:

```
https://your-app.vercel.app/**
```

### Market Sync (optional)

Trigger a live data sync manually or via a cron service:

```bash
curl -X POST https://your-app.vercel.app/api/market/sync \
  -H "x-sync-secret: YOUR_MARKET_SYNC_SECRET"
```

Response includes `syncedPricesCount`, `syncedIndicatorsCount`, `source`, and `syncedAt`.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages + API routes
│   ├── api/              # REST endpoints (portfolio, dca, rebalance, reports, …)
│   ├── dashboard/
│   ├── portfolio/
│   ├── market/
│   ├── ai-strategy/
│   ├── dca/
│   ├── rebalancing/
│   ├── reports/
│   └── settings/
├── components/
│   ├── layout/           # Sidebar, Topbar, MainLayout
│   ├── ui/               # LoadingState, ErrorState, EmptyState, SkeletonCard
│   └── [feature]/        # Feature-specific components
├── services/
│   ├── client/           # Browser-safe API clients
│   └── *.server.ts       # Server-only Supabase services
├── lib/
│   ├── supabase/         # Browser + server Supabase clients
│   ├── market/           # Twelvedata, Finnhub, CoinGecko helpers
│   └── auth/
├── types/                # TypeScript interfaces
├── constants/            # Demo/fallback data
└── utils/                # Export utilities (PDF, CSV, Excel)
```

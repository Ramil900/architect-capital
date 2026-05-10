# Production QA Checklist — Архитектор Капитала

Run this checklist before every production deploy. Check off each item. Do not deploy with open `[ ]` items in sections 1–7.

---

## 1. Build Checks

| # | Check | Pass |
|---|-------|------|
| 1.1 | `npm run build` completes without errors | `[ ]` |
| 1.2 | `npm run lint` returns zero errors (warnings allowed) | `[ ]` |
| 1.3 | No TypeScript errors in build output (`error TS`) | `[ ]` |
| 1.4 | No `console.error` or unhandled promise rejections in dev server | `[ ]` |
| 1.5 | `.next/` folder generated successfully | `[ ]` |

---

## 2. Auth Checks

| # | Check | Pass |
|---|-------|------|
| 2.1 | `/register` — new user can create account | `[ ]` |
| 2.2 | `/login` — existing user can sign in | `[ ]` |
| 2.3 | Logout clears session and redirects to `/login` | `[ ]` |
| 2.4 | Visiting `/dashboard` while logged out redirects to `/login` | `[ ]` |
| 2.5 | Visiting `/login` while logged in redirects to `/dashboard` | `[ ]` |
| 2.6 | API routes return `401` when called without session | `[ ]` |
| 2.7 | Supabase Auth callback URL configured (`https://your-app.vercel.app/**`) | `[ ]` |

---

## 3. Pages Checks

For each page: loads without error, shows real or demo data, no layout breaks.

| # | Page | Loads | Data | No errors |
|---|------|-------|------|-----------|
| 3.1 | `/dashboard` | `[ ]` | `[ ]` | `[ ]` |
| 3.2 | `/portfolio` | `[ ]` | `[ ]` | `[ ]` |
| 3.3 | `/market` | `[ ]` | `[ ]` | `[ ]` |
| 3.4 | `/ai-strategy` | `[ ]` | `[ ]` | `[ ]` |
| 3.5 | `/dca` | `[ ]` | `[ ]` | `[ ]` |
| 3.6 | `/rebalancing` | `[ ]` | `[ ]` | `[ ]` |
| 3.7 | `/reports` | `[ ]` | `[ ]` | `[ ]` |
| 3.8 | `/settings` | `[ ]` | `[ ]` | `[ ]` |
| 3.9 | `/random-nonexistent-route` shows 404 page | `[ ]` | — | `[ ]` |
| 3.10 | Forced error shows error boundary with Try Again + Go Dashboard | `[ ]` | — | `[ ]` |

---

## 4. API Checks

Test each endpoint in browser or with `curl`. Expected: `{ success: true, data: {...}, error: null }`.

| # | Endpoint | Method | Auth | 200 OK | Correct shape |
|---|----------|--------|------|--------|---------------|
| 4.1 | `/api/portfolio` | GET | Yes | `[ ]` | `[ ]` |
| 4.2 | `/api/market/prices` | GET | No | `[ ]` | `[ ]` |
| 4.3 | `/api/market/indicators` | GET | No | `[ ]` | `[ ]` |
| 4.4 | `/api/market/regime` | GET | No | `[ ]` | `[ ]` |
| 4.5 | `/api/ai/analyze` | GET | No | `[ ]` | `[ ]` |
| 4.6 | `/api/ai/analyze` | POST | Yes | `[ ]` | `[ ]` |
| 4.7 | `/api/dca` | GET | Yes | `[ ]` | `[ ]` |
| 4.8 | `/api/rebalance` | GET | Yes | `[ ]` | `[ ]` |
| 4.9 | `/api/reports` | GET | Yes | `[ ]` | `[ ]` |
| 4.10 | `/api/notifications` | GET | Yes | `[ ]` | `[ ]` |
| 4.11 | Unauthenticated POST to `/api/ai/analyze` returns `401` | `[ ]` | — | — |
| 4.12 | Rate limit: 11th AI request within 10 min returns `429` | `[ ]` | — | — |

---

## 5. Export Checks

Open `/reports`, generate a report, then test each export.

| # | Check | Pass |
|---|-------|------|
| 5.1 | **PDF** — Export PDF button triggers download | `[ ]` |
| 5.2 | PDF file opens and displays title, date, portfolio data | `[ ]` |
| 5.3 | PDF contains AI summary and recommendations | `[ ]` |
| 5.4 | PDF footer shows disclaimer | `[ ]` |
| 5.5 | **CSV** — Export CSV button triggers download | `[ ]` |
| 5.6 | CSV file opens in spreadsheet, fields populated | `[ ]` |
| 5.7 | **Excel** — Export Excel button triggers download | `[ ]` |
| 5.8 | Excel file has Summary and Recommendations sheets | `[ ]` |

---

## 6. Market Refresh Checks

| # | Check | Pass |
|---|-------|------|
| 6.1 | `/market` page — "Refresh Market Data" button triggers POST without error | `[ ]` |
| 6.2 | `/api/market/refresh` POST with session returns `{ success: true }` | `[ ]` |
| 6.3 | `/api/market/refresh` POST without session returns `401` | `[ ]` |
| 6.4 | 6th refresh within 10 min returns `429` | `[ ]` |
| 6.5 | `/api/cron/market-refresh?secret=CORRECT` returns `{ success: true, data: { refreshed: true } }` | `[ ]` |
| 6.6 | `/api/cron/market-refresh?secret=WRONG` returns `401` | `[ ]` |
| 6.7 | `/api/cron/market-refresh` with no secret returns `401` | `[ ]` |
| 6.8 | `vercel.json` cron schedule is `*/15 * * * *` | `[ ]` |

---

## 7. Security Checks

| # | Check | Pass |
|---|-------|------|
| 7.1 | `.env.local` is NOT committed (`git status` shows no `.env.local`) | `[ ]` |
| 7.2 | `.gitignore` includes `.env*` (except `.env.example`) | `[ ]` |
| 7.3 | `OPENAI_API_KEY` is not present in any client bundle (check browser Network tab) | `[ ]` |
| 7.4 | `SUPABASE_SERVICE_ROLE_KEY` is not in `src/constants/env.ts` or any client file | `[ ]` |
| 7.5 | `TWELVEDATA_API_KEY`, `FINNHUB_API_KEY`, `COINGECKO_API_KEY` not in client bundle | `[ ]` |
| 7.6 | Supabase RLS is enabled on all user tables | `[ ]` |
| 7.7 | RLS policies: users can only read/write their own rows | `[ ]` |
| 7.8 | `CRON_SECRET` is a random string ≥ 32 characters | `[ ]` |
| 7.9 | `MARKET_SYNC_SECRET` is a random string ≥ 32 characters | `[ ]` |
| 7.10 | No hardcoded secrets or API keys in source files | `[ ]` |

---

## 8. Mobile Checks

Test on 375px (iPhone SE) and 768px (iPad) viewports.

| # | Check | 375px | 768px |
|---|-------|-------|-------|
| 8.1 | Sidebar collapses on mobile, toggle opens/closes it | `[ ]` | `[ ]` |
| 8.2 | Sidebar does not overlap content when closed | `[ ]` | — |
| 8.3 | Topbar fits in viewport, no overflow | `[ ]` | `[ ]` |
| 8.4 | Dashboard cards stack to 1 column | `[ ]` | `[ ]` |
| 8.5 | Portfolio table scrolls horizontally or renders as cards | `[ ]` | `[ ]` |
| 8.6 | Rebalancing table scrolls horizontally or renders as cards | `[ ]` | `[ ]` |
| 8.7 | Reports history table scrolls horizontally or renders as cards | `[ ]` | `[ ]` |
| 8.8 | Charts do not break page width (no horizontal scroll on `<body>`) | `[ ]` | `[ ]` |
| 8.9 | `/settings` form fields are full-width and usable | `[ ]` | `[ ]` |
| 8.10 | Export buttons on `/reports` are tappable | `[ ]` | `[ ]` |

---

## 9. Production Deploy Checks

| # | Check | Pass |
|---|-------|------|
| 9.1 | `NEXT_PUBLIC_SUPABASE_URL` set in Vercel environment | `[ ]` |
| 9.2 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel environment | `[ ]` |
| 9.3 | `SUPABASE_SERVICE_ROLE_KEY` set in Vercel environment (server-only) | `[ ]` |
| 9.4 | `OPENAI_API_KEY` set in Vercel environment (optional) | `[ ]` |
| 9.5 | `TWELVEDATA_API_KEY` set in Vercel environment (optional) | `[ ]` |
| 9.6 | `COINGECKO_API_KEY` set in Vercel environment (optional) | `[ ]` |
| 9.7 | `CRON_SECRET` set in Vercel environment | `[ ]` |
| 9.8 | `NEXT_PUBLIC_APP_URL` set to production domain | `[ ]` |
| 9.9 | Vercel deployment status is **Ready** (no build errors) | `[ ]` |
| 9.10 | Production URL opens app and redirects unauthenticated user to `/login` | `[ ]` |
| 9.11 | Vercel Cron tab shows `/api/cron/market-refresh` scheduled | `[ ]` |
| 9.12 | Custom domain configured and SSL active (optional) | `[ ]` |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA | | | |

> **Deploy rule:** sections 1–7 must be fully checked before merging to `main` and triggering a production deploy.

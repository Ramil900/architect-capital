// NEXT_PUBLIC_ vars must use literal property access so Next.js can inline them at build time.
// Dynamic access via process.env[key] is not replaced in the client bundle.

export const env = {
  supabase: {
    url:            process.env.NEXT_PUBLIC_SUPABASE_URL      ?? "",
    anonKey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  market: {
    twelvedataKey: process.env.TWELVEDATA_API_KEY,
    finnhubKey:    process.env.FINNHUB_API_KEY,
    coingeckoKey:  process.env.COINGECKO_API_KEY,
    syncSecret:    process.env.MARKET_SYNC_SECRET,
  },
} as const;

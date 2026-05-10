// NEXT_PUBLIC_ vars use literal access so Next.js can inline them at build time.
// Dynamic process.env[key] access is NOT replaced in the client bundle.
// IMPORTANT: only NEXT_PUBLIC_* vars belong here — server-only secrets must be
// accessed via process.env directly inside server components / API routes.

export const env = {
  supabaseUrl:  process.env.NEXT_PUBLIC_SUPABASE_URL      ?? "",
  supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  appUrl:       process.env.NEXT_PUBLIC_APP_URL            ?? "",
  appName:      process.env.NEXT_PUBLIC_APP_NAME           ?? "Архитектор Капитала",
} as const;

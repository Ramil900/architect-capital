function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    console.warn(`[env] Missing ${key} — using empty string placeholder`);
    return "";
  }
  return value;
}

function optionalEnv(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  supabase: {
    url:            requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey:        requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: optionalEnv("SUPABASE_SERVICE_ROLE_KEY"),
  },
} as const;

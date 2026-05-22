function trimEnv(value: string): string {
  return value.trim().replace(/^["']|["']$/g, "");
}

export function parsePgUser(connectionUrl: string): string | null {
  const match = connectionUrl.match(/^postgres(?:ql)?:\/\/([^:]+):/i);
  const user = match?.[1];
  return user ? decodeURIComponent(user) : null;
}

export function deriveDirectUrl(poolerUrl: string): string {
  let direct = poolerUrl.replace(/:6543(\/|\?)/g, ":5432$1");
  direct = direct.replace(/[?&]pgbouncer=true/g, "");
  direct = direct.replace(/\?&/, "?").replace(/\?$/, "");
  return direct;
}

export function normalizeDatabaseEnv(): void {
  for (const key of [
    "DATABASE_URL",
    "DIRECT_URL",
    "SUPABASE_DATABASE_URL",
  ] as const) {
    const value = process.env[key];
    if (value) process.env[key] = trimEnv(value);
  }

  if (!process.env.DATABASE_URL && process.env.SUPABASE_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
  }

  if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
    process.env.DIRECT_URL = deriveDirectUrl(process.env.DATABASE_URL);
  }
}

/**
 * Maps Railway/Vercel variable names to what Prisma expects.
 * Call before start.js checks or prisma migrate deploy.
 */
function deriveDirectUrl(poolerUrl) {
  let direct = poolerUrl.replace(/:6543(\/|\?)/g, ":5432$1");
  direct = direct.replace(/[?&]pgbouncer=true/g, "");
  direct = direct.replace(/\?&/, "?").replace(/\?$/, "");
  return direct;
}

function normalizeDatabaseEnv() {
  if (!process.env.DATABASE_URL && process.env.SUPABASE_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
  }

  if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
    process.env.DIRECT_URL = deriveDirectUrl(process.env.DATABASE_URL);
  }
}

module.exports = { normalizeDatabaseEnv, deriveDirectUrl };

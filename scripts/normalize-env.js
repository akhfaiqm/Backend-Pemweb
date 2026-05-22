/**
 * Maps Railway/Vercel variable names to what Prisma expects.
 * Call before start.js checks or prisma migrate deploy.
 */

function trimEnv(value) {
  if (!value) return value;
  return value.trim().replace(/^["']|["']$/g, "");
}

function parsePgUser(connectionUrl) {
  try {
    const match = connectionUrl.match(
      /^postgres(?:ql)?:\/\/([^:]+):/i
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function deriveDirectUrl(poolerUrl) {
  let direct = poolerUrl.replace(/:6543(\/|\?)/g, ":5432$1");
  direct = direct.replace(/[?&]pgbouncer=true/g, "");
  direct = direct.replace(/\?&/, "?").replace(/\?$/, "");
  return direct;
}

function normalizeDatabaseEnv() {
  for (const key of [
    "DATABASE_URL",
    "DIRECT_URL",
    "SUPABASE_DATABASE_URL",
  ]) {
    if (process.env[key]) {
      process.env[key] = trimEnv(process.env[key]);
    }
  }

  if (!process.env.DATABASE_URL && process.env.SUPABASE_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
  }

  if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
    process.env.DIRECT_URL = deriveDirectUrl(process.env.DATABASE_URL);
  }
}

function validateDatabaseEnv() {
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const directUrl = process.env.DIRECT_URL ?? "";
  const user = parsePgUser(directUrl || databaseUrl);

  if (!user) {
    return "URL database tidak valid. Copy dari Supabase → Connect → ORMs → Prisma.";
  }

  if (user === "postgres") {
    return [
      "Username masih 'postgres' — Supabase Prisma butuh postgres.PROJECT_REF",
      "Contoh: postgres.ibtjkiiinqaeikbqwbks",
      "Jangan pakai URL 'Direct connection' / Session — ambil dari tab Prisma (6543 + 5432).",
    ].join("\n   ");
  }

  if (!user.includes(".")) {
    return `Username '${user}' tidak valid. Harus seperti postgres.ibtjkiiinqaeikbqwbks`;
  }

  if (databaseUrl.includes(":6543") && !directUrl.includes(":5432")) {
    return "DIRECT_URL harus port 5432 (migrate). Set manual atau pakai DATABASE_URL pooler yang benar.";
  }

  return null;
}

module.exports = {
  normalizeDatabaseEnv,
  deriveDirectUrl,
  validateDatabaseEnv,
  parsePgUser,
};

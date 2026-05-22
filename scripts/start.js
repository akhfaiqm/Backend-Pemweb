const { execSync } = require("node:child_process");
const {
  normalizeDatabaseEnv,
  validateDatabaseEnv,
  parsePgUser,
} = require("./normalize-env.js");

normalizeDatabaseEnv();

const PLACEHOLDERS = ["[PROJECT-REF]", "[PASSWORD]", "placeholder"];

function hasPlaceholder(value) {
  return PLACEHOLDERS.some((token) => value.includes(token));
}

const databaseUrl = process.env.DATABASE_URL ?? "";
const directUrl = process.env.DIRECT_URL ?? "";

if (!databaseUrl || !directUrl) {
  console.error("❌ DATABASE_URL atau DIRECT_URL kosong di Railway Variables.");
  console.error(
    "   Set DATABASE_URL + DIRECT_URL, atau cukup SUPABASE_DATABASE_URL (DIRECT_URL di-derive otomatis)."
  );
  process.exit(1);
}

if (hasPlaceholder(databaseUrl) || hasPlaceholder(directUrl)) {
  console.error("❌ DATABASE_URL / DIRECT_URL masih pakai placeholder (.env.example).");
  console.error(
    "   Buka Supabase → Connect → Prisma, copy URL asli, paste ke Railway Variables."
  );
  console.error(
    "   Username harus seperti postgres.ibtjkiiinqaeikbqwbks (bukan postgres.[PROJECT-REF])."
  );
  process.exit(1);
}

const validationError = validateDatabaseEnv();
if (validationError) {
  console.error("❌ Konfigurasi database Railway salah:\n   " + validationError);
  process.exit(1);
}

const dbUser = parsePgUser(directUrl);
console.log(
  `Database migrate → ${dbUser} @ aws-1-ap-southeast-1.pooler.supabase.com:5432`
);

console.log("Running prisma migrate deploy...");
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} catch {
  console.warn(
    "\n⚠️  prisma migrate deploy gagal — server tetap dijalankan."
  );
  console.warn(
    "   Cek /health untuk status DB. Perbaiki Railway: DATABASE_URL (6543) + DIRECT_URL (5432)."
  );
  console.warn(
    "   Username harus postgres.ibtjkiiinqaeikbqwbks, password & → %26, tanpa kutip."
  );
}

console.log("Starting server...");
execSync("node dist/index.js", { stdio: "inherit" });

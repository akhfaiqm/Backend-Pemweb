const { execSync } = require("node:child_process");
const { normalizeDatabaseEnv } = require("./normalize-env.js");

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

console.log("Running prisma migrate deploy...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("Starting server...");
execSync("node dist/index.js", { stdio: "inherit" });

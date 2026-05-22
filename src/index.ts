import "dotenv/config";
import express from "express";
import cors from "cors";

import {
  normalizeDatabaseEnv,
  parsePgUser,
} from "./lib/normalizeEnv.js";
import { prisma } from "./lib/db.js";

normalizeDatabaseEnv();
import eventRoutes from "./routes/eventRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";

const app = express();

// Railway: jangan set PORT manual di Variables — pakai yang di-inject platform
const port = Number(process.env.PORT);
const host = process.env.HOST ?? "0.0.0.0";

if (!Number.isFinite(port)) {
  console.error("PORT env tidak ada. Lokal: PORT=3000 npm run dev");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);
app.use("/speakers", speakerRoutes);

app.get("/", (req, res) => {
  res.send("API INVOFEST");
});

app.get("/health", async (_req, res) => {
  const hasDbUrl = Boolean(process.env.DATABASE_URL);
  const hasDirectUrl = Boolean(process.env.DIRECT_URL);

  const placeholder =
    process.env.DATABASE_URL?.includes("[PROJECT-REF]") ||
    process.env.DATABASE_URL?.includes("[PASSWORD]") ||
    process.env.DIRECT_URL?.includes("[PROJECT-REF]") ||
    process.env.DIRECT_URL?.includes("[PASSWORD]");

  const dbUser = parsePgUser(process.env.DATABASE_URL ?? "");

  if (!hasDbUrl || !hasDirectUrl) {
    return res.status(503).json({
      ok: false,
      database: "env_missing",
      message:
        "DATABASE_URL / DIRECT_URL (atau SUPABASE_DATABASE_URL) belum di-set di Railway Variables",
      hasDatabaseUrl: hasDbUrl,
      hasDirectUrl: hasDirectUrl,
      dbUser,
    });
  }

  if (dbUser === "postgres") {
    return res.status(503).json({
      ok: false,
      database: "wrong_username",
      message:
        "Username masih 'postgres'. Railway harus pakai postgres.ibtjkiiinqaeikbqwbks (dari Supabase → Prisma).",
      dbUser,
    });
  }

  if (placeholder) {
    return res.status(503).json({
      ok: false,
      database: "placeholder",
      message:
        "Railway masih pakai [PROJECT-REF] / [PASSWORD]. Copy URL asli dari Supabase → Connect → Prisma.",
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, database: "connected", dbUser });
  } catch (err) {
    console.error("[health]", err);
    const detail =
      err instanceof Error ? err.message : "Unknown database error";
    res.status(503).json({
      ok: false,
      database: "connection_failed",
      message:
        "Tidak bisa konek ke database. Copy ulang DATABASE_URL + DIRECT_URL dari .env lokal ke Railway (password & → %26).",
      dbUser,
      detail,
    });
  }
});

const server = app.listen(port, host, () => {
  console.log(`Server ready → http://${host}:${port}`);
});

server.on("error", (err) => {
  console.error("[server] listen error:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("[unhandledRejection]", err);
});
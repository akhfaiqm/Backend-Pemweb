import "dotenv/config";
import express from "express";
import cors from "cors";

import { normalizeDatabaseEnv } from "./lib/normalizeEnv.js";
import { prisma } from "./lib/db.js";

normalizeDatabaseEnv();
import eventRoutes from "./routes/eventRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

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

  if (!hasDbUrl || !hasDirectUrl) {
    return res.status(503).json({
      ok: false,
      database: "env_missing",
      message:
        "DATABASE_URL / DIRECT_URL (atau SUPABASE_DATABASE_URL) belum di-set di Railway Variables",
      hasDatabaseUrl: hasDbUrl,
      hasDirectUrl: hasDirectUrl,
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
    res.json({ ok: true, database: "connected" });
  } catch (err) {
    console.error("[health]", err);
    res.status(503).json({
      ok: false,
      database: "connection_failed",
      message:
        "Tidak bisa konek ke database. Cek URL Supabase (pooler 6543 + direct 5432) dan jalankan migrate deploy.",
    });
  }
});

app.listen(port, () => {
console.log(`Server lagi jalan di http://localhost:${port}`);
});
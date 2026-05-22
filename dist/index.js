"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const normalizeEnv_js_1 = require("./lib/normalizeEnv.js");
const db_js_1 = require("./lib/db.js");
(0, normalizeEnv_js_1.normalizeDatabaseEnv)();
const eventRoutes_js_1 = __importDefault(require("./routes/eventRoutes.js"));
const categoryRoutes_js_1 = __importDefault(require("./routes/categoryRoutes.js"));
const speakerRoutes_js_1 = __importDefault(require("./routes/speakerRoutes.js"));
const app = (0, express_1.default)();
// Railway: jangan set PORT manual di Variables — pakai yang di-inject platform
const port = Number(process.env.PORT);
const host = process.env.HOST ?? "0.0.0.0";
if (!Number.isFinite(port)) {
    console.error("PORT env tidak ada. Lokal: PORT=3000 npm run dev");
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/events", eventRoutes_js_1.default);
app.use("/categories", categoryRoutes_js_1.default);
app.use("/speakers", speakerRoutes_js_1.default);
app.get("/", (req, res) => {
    res.send("API INVOFEST");
});
app.get("/health", async (_req, res) => {
    const hasDbUrl = Boolean(process.env.DATABASE_URL);
    const hasDirectUrl = Boolean(process.env.DIRECT_URL);
    const placeholder = process.env.DATABASE_URL?.includes("[PROJECT-REF]") ||
        process.env.DATABASE_URL?.includes("[PASSWORD]") ||
        process.env.DIRECT_URL?.includes("[PROJECT-REF]") ||
        process.env.DIRECT_URL?.includes("[PASSWORD]");
    const dbUser = (0, normalizeEnv_js_1.parsePgUser)(process.env.DATABASE_URL ?? "");
    if (!hasDbUrl || !hasDirectUrl) {
        return res.status(503).json({
            ok: false,
            database: "env_missing",
            message: "DATABASE_URL / DIRECT_URL (atau SUPABASE_DATABASE_URL) belum di-set di Railway Variables",
            hasDatabaseUrl: hasDbUrl,
            hasDirectUrl: hasDirectUrl,
            dbUser,
        });
    }
    if (dbUser === "postgres") {
        return res.status(503).json({
            ok: false,
            database: "wrong_username",
            message: "Username masih 'postgres'. Railway harus pakai postgres.ibtjkiiinqaeikbqwbks (dari Supabase → Prisma).",
            dbUser,
        });
    }
    if (placeholder) {
        return res.status(503).json({
            ok: false,
            database: "placeholder",
            message: "Railway masih pakai [PROJECT-REF] / [PASSWORD]. Copy URL asli dari Supabase → Connect → Prisma.",
        });
    }
    try {
        await db_js_1.prisma.$queryRaw `SELECT 1`;
        res.json({ ok: true, database: "connected", dbUser });
    }
    catch (err) {
        console.error("[health]", err);
        res.status(503).json({
            ok: false,
            database: "connection_failed",
            message: "Tidak bisa konek ke database. Cek URL Supabase (pooler 6543 + direct 5432) dan jalankan migrate deploy.",
            dbUser,
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
//# sourceMappingURL=index.js.map
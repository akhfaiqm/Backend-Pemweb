"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePgUser = parsePgUser;
exports.deriveDirectUrl = deriveDirectUrl;
exports.normalizeDatabaseEnv = normalizeDatabaseEnv;
function trimEnv(value) {
    return value.trim().replace(/^["']|["']$/g, "");
}
function parsePgUser(connectionUrl) {
    const match = connectionUrl.match(/^postgres(?:ql)?:\/\/([^:]+):/i);
    const user = match?.[1];
    return user ? decodeURIComponent(user) : null;
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
        const value = process.env[key];
        if (value)
            process.env[key] = trimEnv(value);
    }
    if (!process.env.DATABASE_URL && process.env.SUPABASE_DATABASE_URL) {
        process.env.DATABASE_URL = process.env.SUPABASE_DATABASE_URL;
    }
    if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
        process.env.DIRECT_URL = deriveDirectUrl(process.env.DATABASE_URL);
    }
}
//# sourceMappingURL=normalizeEnv.js.map
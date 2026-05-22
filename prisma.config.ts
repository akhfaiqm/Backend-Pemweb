import "dotenv/config";
import { defineConfig } from "prisma/config";
import process from "process";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { deriveDirectUrl, normalizeDatabaseEnv } = require("./scripts/normalize-env.js");

normalizeDatabaseEnv();

// Placeholder for `prisma generate` when env vars are not set (e.g. Railway build)
const PLACEHOLDER_DB_URL =
  "postgresql://placeholder:placeholder@localhost:5432/placeholder";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl ?? PLACEHOLDER_DB_URL,
    directUrl: directUrl ?? databaseUrl ?? PLACEHOLDER_DB_URL,
  },
});

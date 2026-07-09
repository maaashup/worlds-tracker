import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

const isProduction = process.env.NODE_ENV === "production";

const dbUrl = process.env.DATABASE_URL || process.env.DB_URL || process.env.LOCAL_DB_URL;

if (!dbUrl) {
  throw new Error("Database connection URL could not be resolved from environment variables.");
}

const dbConfig: DBConfig = {
  url: dbUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  migrationConfig: migrationConfig
};

//This is the config loader that will be used throughout the API and can be expanded upon when needed.
export const config = {
    db: dbConfig,
    secretKey: envOrThrow("JWT_KEY"),
};


//Data types
type DBConfig = {
  url: string;
  ssl: boolean | { rejectUnauthorized: boolean };
  migrationConfig: MigrationConfig;
}

//Helper Functions
function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} does not resolve to anything`);
    }
    return value;
}
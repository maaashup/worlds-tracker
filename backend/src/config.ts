import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

const dbConfig: DBConfig = {
  host: envOrThrow("API_HOST"),
  port: Number(envOrThrow("DB_PORT")),
  user: envOrThrow("DB_USER"),
  password: envOrThrow("DB_PASSWORD"),
  database: envOrThrow("DB_NAME"),
  migrationConfig: migrationConfig
}

//This is the config loader that will be used throughout the API and can be expanded upon when needed.
export const config = {
    db: dbConfig,
    secretKey: envOrThrow("JWT_KEY"),
};


//Data types
type DBConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    migrationConfig: MigrationConfig
}

//Helper Functions
function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} does not resolve to anything`);
    }
    return value;
}
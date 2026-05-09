import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

const dbConfig: DBConfig = {
    dbURL: envOrThrow("DB_URL") + "?sslmode=disable",
    migrationConfig: migrationConfig
}

//This is the config loader that will be used throughout the API and can be expanded upon when needed.
export const config = {
    db: dbConfig,
};


//Data types
type DBConfig = {
    dbURL: string,
    migrationConfig: MigrationConfig
}

//Helper Functions
function envOrThrow(key: string) {
    if(!process.env[key]) {
        throw new Error(`${key} does not resolve to anything`);
    }

    return process.env[key];
}
import { defineConfig } from 'drizzle-kit';
 
let dbUrl = process.env.DATABASE_URL || process.env.DB_URL || process.env.LOCAL_DB_URL;
if (!dbUrl) {
  throw new Error("Database connection URL could not be resolved from environment variables.");
}

if (process.env.NODE_ENV === 'production' && dbUrl) {
  const parsedUrl = new URL(dbUrl);
  parsedUrl.searchParams.set('sslmode', 'require');
  dbUrl = parsedUrl.toString();
}

export default defineConfig({
  schema: "./src/db/schema.ts", 
  out: "./src/db/migrations", 
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: dbUrl, // 🚀 Uses our clean, dynamically compiled connection endpoint!
  },
});
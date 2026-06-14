import { defineConfig } from 'drizzle-kit';
 
export default defineConfig({
  schema: "./src/db/schema.ts", // path to your schema.ts file
  out: "./src/db/migrations", // path to your migrations
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_EXTERNAL_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  ssl: false, // Explicitly disable SSL
},
})
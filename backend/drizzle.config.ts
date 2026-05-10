import { defineConfig } from "drizzle-kit"
 
export default defineConfig({
  schema: "./src/db/schema.ts", // path to your schema.ts file
  out: "./src/db/migrations", // path to your migrations
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
  host: "db",
  port: 5432,
  user: "worldsowner",
  password: "worldspwd",
  database: "worldstrackerdb",
  ssl: false, // Explicitly disable SSL
},
})
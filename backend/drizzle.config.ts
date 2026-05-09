import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema.ts", // path to your schema.ts file
  out: "./src/db/migrations", // path to your migrations
  dialect: "postgresql",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: "postgresql://testuser:testpass@db:5432/testname?sslmode=disable",
  },
})
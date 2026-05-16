import express from "express";
import { Request, Response } from "express";

import { middlewareLogging, middlewareErrorHandler } from "./middleware/middlewareLogging.js";
import { respondWithJSON } from "./helperfunctions/respondWithJSON.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { createEventTimeline, getAllEventTimelines, getEventTimelineByID, getEventTimelineByEventYear } from "./endpoints/eventTimeline.js";

await runMigrations();

const env = process.env;
const PORT = env.API_PORT || 3000;
const API_URL = env.API_URL;

const app = express();

app.use(middlewareLogging);
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  respondWithJSON(res, 200, { status: "OK" });
});

//Main Backend Endpoints:
app.post("/api/event-timeline/create", createEventTimeline);
app.get("/api/event-timeline", getAllEventTimelines);
app.get("/api/event-timeline/id/:id", getEventTimelineByID);
app.get("/api/event-timeline/event-year/:eventYear", getEventTimelineByEventYear);





app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at ${API_URL}:${PORT}`);
});

async function runMigrations() {
  try {
    const migrationClient = postgres(config.db.dbURL, { max: 1 });
    await migrate(drizzle(migrationClient), config.db.migrationConfig);
    console.log("✅ Migrations completed!");
  } catch (error) {
    console.error("❌ Migration failed, retrying in 5 seconds...", error);
    await new Promise(res => setTimeout(res, 5000));
    return runMigrations(); // Recursive retry
  }
}
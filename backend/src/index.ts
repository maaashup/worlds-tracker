import express from "express";
import { Request, Response } from "express";

import { middlewareLogging, middlewareErrorHandler } from "./middleware/middlewareLogging.js";
import { respondWithJSON } from "./helperfunctions/respondWithJSON.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";

import { createEventTimeline, getAllEventTimelines, getEventTimelineByID, getEventTimelineByEventYear } from "./endpoints/eventTimeline.js";
import { createEventType, getAllEventTypes, getEventTypeByCode } from "./endpoints/eventType.js";
import { createEventSeries } from "./endpoints/eventSeries.js";
import { createFormat, getFormatById, getFormats } from "./endpoints/format.js";
import { createPlayerResult, getPlayerResults, getPlayerResultsById, getPlayerResultsByNaviId } from "./endpoints/playerResult.js";

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

// Event Timeline Endpoints:
app.post("/api/event-timeline/create", createEventTimeline);
app.get("/api/event-timeline", getAllEventTimelines);
app.get("/api/event-timeline/id/:id", getEventTimelineByID);
app.get("/api/event-timeline/event-year/:eventYear", getEventTimelineByEventYear);

//Event Series Endpoints:
app.post("/api/event-series/create", createEventSeries);
app.get("/api/event-series", getAllEventTimelines);

//Player Results Endpoints:
app.post("/api/player-result/create", createPlayerResult);
app.get("/api/player-result/all", getPlayerResults);
app.get("/api/player-result/id/:id", getPlayerResultsById);
app.get("/api/player-result/navi-id/:naviId", getPlayerResultsByNaviId);


//Helper Endpoints:
app.post("/api/event-type/create", createEventType);
app.get("/api/event-type", getAllEventTypes);
app.get("/api/event-type/code/:code", getEventTypeByCode);

app.post("/api/format/create", createFormat);
app.get("/api/format", getFormats);
app.get("/api/format/id/:id", getFormatById);


app.use(middlewareErrorHandler);


startServer();

async function startServer() {
  await runMigrations();

  app.listen(PORT, () => {
    console.log(`Server is running at ${API_URL}:${PORT}`);
  });
}

async function runMigrations() {
  try {
    const migrationClient = postgres({
      host: config.db.host,
      port: config.db.port,
      username: config.db.user,
      password: config.db.password,
      database: config.db.database,
      max: 1,
    });
    await migrate(drizzle(migrationClient), config.db.migrationConfig);
    console.log("✅ Migrations completed!");
  } catch (error) {
    console.error("❌ Migration failed, retrying in 5 seconds...", error);
    await new Promise(res => setTimeout(res, 5000));
    return runMigrations(); // Recursive retry
  }
}
import express from "express";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";

import {
  middlewareLogging,
  middlewareErrorHandler,
} from "./middleware/middlewareLogging.js";
import { respondWithJSON } from "./helperfunctions/respondWithJSON.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";

import { eventTimelineRoutes } from "./routes/eventTimelineRoutes.js";
import { eventSeriesRoutes } from "./routes/eventSeriesRoutes.js";
import { eventTypeRoutes } from "./routes/eventTypeRoutes.js";
import { formatRoutes } from "./routes/formatRoutes.js";
import { playerResultRoutes } from "./routes/playerResultRoutes.js";
import { regionRoutes } from "./routes/regionRoutes.js";
import { tokensRoutes } from "./routes/tokensRoutes.js";
import { usersRoutes } from "./routes/usersRoutes.js";

const env = process.env;
const PORT = env.API_PORT || env.PORT || 3000;
const API_URL = env.API_URL;

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true"); //Allows cookies/credentials over CORS.
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(middlewareLogging);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req: Request, res: Response) => {
  respondWithJSON(res, 200, { status: "OK" });
});

// Main backend route modules:
app.use("/api/users", usersRoutes);
app.use("/api/tokens", tokensRoutes);
app.use("/api/event-timeline", eventTimelineRoutes);
app.use("/api/event-series", eventSeriesRoutes);
app.use("/api/player-result", playerResultRoutes);
app.use("/api/event-type", eventTypeRoutes);
app.use("/api/format", formatRoutes);
app.use("/api/regions", regionRoutes);

app.use(middlewareErrorHandler);

startServer();

async function startServer() {
  await runMigrations();

  app.listen(PORT, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`🚀 Server is running live at ${API_URL}`);
    } else {
      console.log(`🚀 Server is running locally at http://localhost:${PORT}`);
    }
  });
}

async function runMigrations() {
  try {
    const migrationClient = postgres(config.db.url, {
      max: 1,
      ssl: config.db.ssl,
    });

    await migrate(drizzle(migrationClient), config.db.migrationConfig);
    console.log("✅ Migrations completed!");
  } catch (error) {
    console.error("❌ Migration failed, retrying in 5 seconds...", error);
    await new Promise((res) => setTimeout(res, 5000));
    return runMigrations(); // Recursive retry
  }
}

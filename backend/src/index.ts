import express from "express";
import { Request, Response } from "express";
import { config } from "./config.js";

import { middlewareLoging } from "./middleware/middlewareLogging.js";
import { respondWithJSON } from "./helperfunctions/respondWithJSON.js";

const env = process.env;
const PORT = env.API_PORT || 3000;
const API_URL = env.API_URL;

const app = express();

app.use(middlewareLoging);
app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  respondWithJSON(res, 200, { status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${API_URL}:${PORT}`);
});

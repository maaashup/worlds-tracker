import { Request, Response } from "express";

// import { RespondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";

import { addEventSeries, getEventSeries, getEventSeriesById } from "../db/query/eventSeries.js";
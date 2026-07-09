import { Router } from "express";

import {
    createEventSeries,
    getAllEventSeries,
    getAllEventSeriesForTimelineYear,
    getEventSummary,
} from "../endpoints/eventSeries.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";

export const eventSeriesRoutes = Router();

eventSeriesRoutes.use(middlewareIsLoggedIn);

eventSeriesRoutes.post("/create", createEventSeries);
eventSeriesRoutes.get("/", getAllEventSeries);
eventSeriesRoutes.get("/:id/all", getAllEventSeriesForTimelineYear);
eventSeriesRoutes.get("/summary", getEventSummary);
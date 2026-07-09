import { Router } from "express";

import {
    createEventTimeline,
    getAllEventTimelines,
    getEventTimelineByEventYear,
    getEventTimelineByID,
} from "../endpoints/eventTimeline.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";

export const eventTimelineRoutes = Router();

eventTimelineRoutes.use(middlewareIsLoggedIn);

eventTimelineRoutes.post("/create", createEventTimeline);
eventTimelineRoutes.get("/", getAllEventTimelines);
eventTimelineRoutes.get("/id/:id", getEventTimelineByID);
eventTimelineRoutes.get("/event-year/:eventYear", getEventTimelineByEventYear);
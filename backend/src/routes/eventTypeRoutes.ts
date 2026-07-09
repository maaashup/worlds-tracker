import { Router } from "express";

import { createEventType, getAllEventTypes, getEventTypeByCode } from "../endpoints/eventType.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";

export const eventTypeRoutes = Router();

eventTypeRoutes.use(middlewareIsLoggedIn);

eventTypeRoutes.post("/create", createEventType);
eventTypeRoutes.get("/", getAllEventTypes);
eventTypeRoutes.get("/code/:code", getEventTypeByCode);
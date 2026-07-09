import { Router } from "express";

import { createFormat, getFormatByCode, getFormatById, getFormats } from "../endpoints/format.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";

export const formatRoutes = Router();

formatRoutes.use(middlewareIsLoggedIn);

formatRoutes.post("/create", createFormat);
formatRoutes.get("/", getFormats);
formatRoutes.get("/id/:id", getFormatById);
formatRoutes.get("/code/:code", getFormatByCode);
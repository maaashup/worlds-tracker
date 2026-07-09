import { Router } from "express";

import { createRegion, getRegionByCode, getRegions } from "../endpoints/region.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";
import { middlewareRequireAdmin } from "../middleware/middlewareRequireAdmin.js";

export const regionRoutes = Router();

regionRoutes.use(middlewareIsLoggedIn);

regionRoutes.post("/create", middlewareRequireAdmin, createRegion);
regionRoutes.get("/", getRegions);
regionRoutes.get("/code/:code", getRegionByCode);
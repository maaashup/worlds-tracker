import { Router } from "express";

import {
    createPlayerResult,
    deletePlayerResults,
    getAllPlayerResultsByEventId,
    getAllPlayerResultsByTimeline,
    getPlayerResults,
    getPlayerResultsById,
    getPlayerResultsByNaviId,
    updatePlayerResults,
} from "../endpoints/playerResult.js";
import { middlewareIsLoggedIn } from "../middleware/middlewareIsLoggedIn.js";

export const playerResultRoutes = Router();

playerResultRoutes.use(middlewareIsLoggedIn);

playerResultRoutes.post("/create", createPlayerResult);
playerResultRoutes.get("/all", getPlayerResults);
playerResultRoutes.get("/id/:id", getPlayerResultsById);
playerResultRoutes.get("/navi-id/:naviId", getPlayerResultsByNaviId);
playerResultRoutes.get("/timelinesummary", getAllPlayerResultsByTimeline);
playerResultRoutes.get("/results", getAllPlayerResultsByEventId);
playerResultRoutes.put("/update/:id", updatePlayerResults);
playerResultRoutes.delete("/delete/:id", deletePlayerResults);
import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBPlayerResults, getDBPlayerResults, getDBPlayerResultsById } from "../db/query/playerResult.js";
import { getDBFormatById } from "../db/query/format.js";
import { getDBEventSeriesById, getDBEventSeriesByName } from "../db/query/eventSeries.js";

export async function createPlayerResult(req: Request, res: Response): Promise<void> {
    
    const { bushiNaviId, playerName, formatId, rank, isSponsored, isFormComplete, invTakenHere, eventSeries } = req.body;

    if (!bushiNaviId || !playerName || !formatId || rank === undefined || isSponsored === undefined || isFormComplete === undefined || invTakenHere === undefined || !eventSeries) {
        throw new BadRequestError("Missing required fields");
    }

    const checkFormat = await getDBFormatById(formatId);
    if (!checkFormat) {
        throw new NotFoundError("Format not found");
    }

    const checkEventSeries = await getDBEventSeriesByName(eventSeries);
    if (!checkEventSeries) {
        throw new NotFoundError("Event series not found");
    }

    const addPlayerResults = await addDBPlayerResults({ bushiNaviId, playerName, formatId, rank, isSponsored, isFormComplete, invTakenHere, eventSeriesId: checkEventSeries.id });
    if (!addPlayerResults) {
        throw new NotFoundError("Failed to create player results");
    }

    respondWithJSON(res, 201, addPlayerResults);

}

export async function getPlayerResult(req: Request, res: Response): Promise<void> {
    const playerResults = await getDBPlayerResults();
    respondWithJSON(res, 200, playerResults);
}
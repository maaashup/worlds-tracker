import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBPlayerResults, getDBPlayerResults, getDBPlayerResultsById } from "../db/query/playerResult.js";
import { getDBFormatById } from "../db/query/format.js";
import { getDBEventSeriesById, getDBEventSeriesByName } from "../db/query/eventSeries.js";
import { getEventTypeByCode } from "./eventType.js";
import { getDBEventTypeByCode } from "../db/query/eventType.js";

export async function createPlayerResult(req: Request, res: Response): Promise<void> {
    
    const { bushiNaviId, playerName, formatId, rank, isSponsored, isFormComplete, invTakenHere, eventSeries, eventType, eventTimelineId } = req.body;

    if (!bushiNaviId || !playerName || !formatId || !rank || !isSponsored || !isFormComplete || !invTakenHere || !eventSeries || !eventType || !eventTimelineId) {
        throw new BadRequestError("Missing required fields");
    }

    //First grab the format (Standard, Premium etc.)
    const checkFormat = await getDBFormatById(formatId);
    if (!checkFormat) {
        throw new NotFoundError("Format not found");
    }

    //Next, grab ID for the event type (BSF/BCS etc.)
    const checkEventType = await getDBEventTypeByCode(eventType);
    if (!checkEventType) {
        throw new NotFoundError("Event type not found");
    }

    //Then, grab the ID for the regional event series (Toronto, Texas etc.)
    const checkEventSeries = await getDBEventSeriesByName(eventSeries, checkEventType.id, eventTimelineId);
    if (!checkEventSeries) {
        throw new NotFoundError("Event series not found");
    }

    //If all checks pass, add player results to the database
    const addPlayerResults = await addDBPlayerResults({
        bushiNaviId: bushiNaviId,
        playerName: playerName,
        formatId: checkFormat.id,
        rank: rank,
        isSponsored: isSponsored,
        isFormComplete: isFormComplete,
        invTakenHere: invTakenHere,
        eventTypeId: checkEventType.id,
        eventSeriesId: checkEventSeries.id
    });
    if (!addPlayerResults) {
        throw new NotFoundError("Failed to create player results");
    }

    respondWithJSON(res, 201, addPlayerResults);

}

export async function getPlayerResult(req: Request, res: Response): Promise<void> {
    const playerResults = await getDBPlayerResults();
    respondWithJSON(res, 200, playerResults);
}
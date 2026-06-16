import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBPlayerResults, getDBPlayerResults, getDBPlayerResultsById, getDBPlayerResultsByNaviId } from "../db/query/playerResult.js";
import { getDBFormatById } from "../db/query/format.js";
import { getDBEventSeriesByName } from "../db/query/eventSeries.js";
import { getDBEventTypeByCode } from "../db/query/eventType.js";

export async function createPlayerResult(req: Request, res: Response): Promise<void> {
    
    const { bushiNaviId, playerName, formatId, rank, isSponsored, isFormComplete, invTakenHere, eventSeries, eventType, eventTimelineId, region } = req.body;

    if (!bushiNaviId || !playerName || !formatId || !rank || !isSponsored || !isFormComplete || !invTakenHere || !eventSeries || !eventType || !eventTimelineId || !region) {
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

    // const checkRegion;

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
        eventSeriesId: checkEventSeries.id,
        regionId: 1
    });
    if (!addPlayerResults) {
        throw new NotFoundError("Failed to create player results");
    }

    respondWithJSON(res, 201, addPlayerResults);

}

export async function getPlayerResults(req: Request, res: Response): Promise<void> {
    const playerResults = await getDBPlayerResults();
    if (!playerResults) {
        throw new BadRequestError("Player Results failed to load");
    }

    respondWithJSON(res, 200, playerResults);
}

export async function getPlayerResultsByNaviId(req: Request, res: Response): Promise<void> {
    const naviId = req.params.naviId as string;
    const playerResults = await getDBPlayerResultsByNaviId(naviId);
    if (!playerResults) {
        throw new NotFoundError("Player result not found");
    }

    respondWithJSON(res, 200, playerResults);
}

export async function getPlayerResultsById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const playerResults = await getDBPlayerResultsById(id);
    if (!playerResults) {
        throw new NotFoundError("Player result not found");
    }
    respondWithJSON(res, 200, playerResults);
}
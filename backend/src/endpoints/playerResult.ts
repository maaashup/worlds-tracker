import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBPlayerResults, getDBPlayerResults, getDBPlayerResultsById, getDBPlayerResultsByNaviId, getDBPlayerResultsForEventSeries, updateDBPlayerResults } from "../db/query/playerResult.js";
import { getDBFormatByCode } from "../db/query/format.js";
import { getDBAllEventSeriesByTLYear, getDBEventSeriesByName } from "../db/query/eventSeries.js";
import { getDBEventTypeByCode } from "../db/query/eventType.js";
import { getDBRegionByCode } from "../db/query/region.js";
import { getDBEventTimelineByEventYear } from "../db/query/eventTimeline.js";

export async function createPlayerResult(req: Request, res: Response): Promise<void> {
    
    const { bushiNaviId, playerName, formatCode, rank, isSponsored, isFormComplete, invTakenHere, isQualified, eventSeries, eventType, eventTimelineYear, regionCode } = req.body;

    if (!bushiNaviId || !playerName || !formatCode || !rank || isSponsored === undefined || isFormComplete === undefined || invTakenHere === undefined || isQualified === undefined || !eventSeries || !eventType || !eventTimelineYear || !regionCode) {
        throw new BadRequestError("Missing required fields");
    }

    const checkEventTimeline = await getDBEventTimelineByEventYear(eventTimelineYear);
    if (!checkEventTimeline) {
        throw new NotFoundError("Event Timeline not found");
    }

    //First grab the format (Standard, Premium etc.)
    const checkFormat = await getDBFormatByCode(formatCode);
    if (!checkFormat) {
        throw new NotFoundError("Format not found");
    }

    //Next, grab ID for the event type (BSF/BCS etc.)
    const checkEventType = await getDBEventTypeByCode(eventType);
    if (!checkEventType) {
        throw new NotFoundError("Event type not found");
    }

    //Then, grab the ID for the regional event series (Toronto, Texas etc.)
    const checkEventSeries = await getDBEventSeriesByName(eventSeries, checkEventType.id, checkEventTimeline.id);
    if (!checkEventSeries) {
        throw new NotFoundError("Event series not found");
    }

    const checkRegion = await getDBRegionByCode(regionCode);
    if (!checkRegion) {
        throw new NotFoundError("Region not found");
    }

    //If all checks pass, add player results to the database
    const addPlayerResults = await addDBPlayerResults({
        bushiNaviId: bushiNaviId,
        playerName: playerName,
        formatCode: checkFormat.code,
        rank: rank,
        isSponsored: isSponsored,
        isFormComplete: isFormComplete,
        invTakenHere: invTakenHere,
        isQualified: isQualified,
        eventTypeId: checkEventType.id,
        eventSeriesId: checkEventSeries.id,
        regionCode: checkRegion.code
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

export async function getAllPlayerResultsByTimeline(req: Request, res: Response): Promise<void> {
    const payload = (req.method === 'GET' ? req.query : req.body) as {
        eventTimelineId?: string;
    };

    const eventTimelineId = payload?.eventTimelineId as string;

    // Get all events for the timeline year and for the specific event type.
    const events = await getDBAllEventSeriesByTLYear(eventTimelineId);
    if (!events) {
        throw new NotFoundError("Event Series could not be found");
    }

    const prArray = [];

    // Loop through each event and store the data.
    for (const event of events) {
        const prData = await getDBPlayerResultsForEventSeries(event.id);
        const dataArray = {
            id: event.id,
            event: event.name,
            date: event.eventDate,
            region: event.regionCode,
            eventType: event.eventType,
            formats: event.formats,
            results: prData
        };

        prArray.push(dataArray);
    }

    respondWithJSON(res, 200, {data: prArray});
}

export async function getAllPlayerResultsByEventId(req: Request, res: Response): Promise<void> {
    const payload = (req.method === 'GET' ? req.query : req.body) as {
        eventId?: string;
    };

    const playerResults = await getDBPlayerResultsForEventSeries(payload.eventId as string);
    if (!playerResults) {
        throw new NotFoundError("Player Results could not be found");
    }

    respondWithJSON(res, 200, {data: playerResults});

}

export async function updatePlayerResults(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { bushiNaviId, playerName, formatCode, rank, isSponsored, isFormComplete, invTakenHere, isQualified } = req.body;

    const updateData: Partial<{
        bushiNaviId: string;
        playerName: string;
        formatCode: string;
        rank: number;
        isSponsored: boolean;
        isFormComplete: boolean;
        invTakenHere: boolean;
        isQualified: boolean;
    }> = {};

    const getOrginalData = await getDBPlayerResultsById(id);
    if (!getOrginalData) {
        throw new NotFoundError("Player result not found");
    }
    
    if (getOrginalData.bushiNaviId !== bushiNaviId) updateData.bushiNaviId = bushiNaviId;
    if (getOrginalData.playerName !== playerName) updateData.playerName = playerName;
    if (getOrginalData.formatCode !== formatCode) updateData.formatCode = formatCode;
    if (getOrginalData.rank !== rank) updateData.rank = rank;
    if (getOrginalData.isSponsored !== isSponsored) updateData.isSponsored = isSponsored;
    if (getOrginalData.isFormComplete !== isFormComplete) updateData.isFormComplete = isFormComplete;
    if (getOrginalData.invTakenHere !== invTakenHere) updateData.invTakenHere = invTakenHere;
    if (getOrginalData.isQualified !== isQualified) updateData.isQualified = isQualified;

    const updatedPlayerResults = await updateDBPlayerResults(id, updateData);
    if (!updatedPlayerResults) {
        throw new NotFoundError("Failed to update player results");
    }

    respondWithJSON(res, 200, {data: updatedPlayerResults});
}
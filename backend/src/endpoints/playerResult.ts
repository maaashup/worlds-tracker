import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBPlayerResults, deleteDBPlayerResults, findDBAllInvitesForPlayer, getDBAllPlayerResultsByTimeline, getDBPlayerResults, getDBPlayerResultsById, getDBPlayerResultsByNaviId, getDBPlayerResultsForEventSeries, updateDBPlayerResults } from "../db/query/playerResult.js";
import { getDBFormatByCode } from "../db/query/format.js";
import { getDBAllEventSeriesByTLYear, getDBEventSeriesByName } from "../db/query/eventSeries.js";
import { getDBEventTypeByCode } from "../db/query/eventType.js";
import { getDBRegionByCode } from "../db/query/region.js";
import { getDBEventTimelineByEventYear } from "../db/query/eventTimeline.js";

export async function createPlayerResult(req: Request, res: Response): Promise<void> {
    
    const { bushiNaviId, playerName, formatCode, rank, isSponsored, isFormComplete, invTakenHere, isQualified, eventSeries, eventType, eventTimelineYear, regionCode, decklog } = req.body;

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

    const username = req.user?.username || "System";

    //If all checks pass, add player results to the database
    const addPlayerResults = await addDBPlayerResults({
        bushiNaviId: bushiNaviId,
        playerName: playerName,
        formatCode: checkFormat.code,
        rank: rank,
        decklog: decklog ?? null,
        isSponsored: isSponsored,
        isFormComplete: isFormComplete,
        invTakenHere: invTakenHere,
        isQualified: isQualified,
        eventTypeId: checkEventType.id,
        eventSeriesId: checkEventSeries.id,
        regionCode: checkRegion.code,
        createdBy: username,
        updatedBy: username
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
    const { bushiNaviId, playerName, formatCode, rank, isSponsored, isFormComplete, invTakenHere, isQualified, decklog } = req.body;

    const username = req.user?.username || "System";

    const updateData: Partial<{
        bushiNaviId: string;
        playerName: string;
        formatCode: string;
        rank: number;
        isSponsored: boolean;
        isFormComplete: boolean;
        invTakenHere: boolean;
        isQualified: boolean;
        decklog: string;
        updatedBy: string;
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
    if (getOrginalData.decklog !== decklog) updateData.decklog = decklog;

    updateData.updatedBy = username;

    const updatedPlayerResults = await updateDBPlayerResults(id, updateData);
    if (!updatedPlayerResults) {
        throw new NotFoundError("Failed to update player results");
    }

    respondWithJSON(res, 200, {data: updatedPlayerResults});
}

export async function deletePlayerResults(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const existingPlayerResults = await getDBPlayerResultsById(id);
    if (!existingPlayerResults) {
        throw new NotFoundError("Player result not found");
    }

    const deletedPlayerResult = await deleteDBPlayerResults(id);
    if (!deletedPlayerResult) {
        throw new NotFoundError("Failed to delete player result");
    }

    respondWithJSON(res, 200, { data: deletedPlayerResult });
}

export async function findAllInvitesForPlayer(req: Request, res: Response): Promise<void> {
    const { bushiNaviId, eventTimeline, eventId, formatCode } = req.query;

    const eventTimelineData = await getDBEventTimelineByEventYear(eventTimeline as string);
    if (!eventTimelineData) {
        throw new NotFoundError("Event Timeline not found");
    }

    // 1. Fetch all historic timeline results for this player
    const invites = await findDBAllInvitesForPlayer(bushiNaviId as string, eventTimelineData.id);

    // 2. Filter strictly by where they have already accepted/locked-in an invite 🔒
    const acceptedInvitesElsewhere = invites.filter(invite => {
        const isCurrentEvent = eventId && invite.eventId === eventId;
        const isCurrentFormat = formatCode && invite.formatCode === formatCode;
        
        // Match only if they accepted it elsewhere, excluding the current submission context
        return invite.invTakenHere === true && !(isCurrentEvent && isCurrentFormat);
    });

    // 3. Boolean flag helper: Did they already consume their single invite slot somewhere else?
    const hasAcceptedInviteElsewhere = acceptedInvitesElsewhere.length > 0;

    // 4. Return the structured list to the frontend
    respondWithJSON(res, 200, {
        data: {
            bushiNaviId,
            timelineYear: eventTimeline,
            hasAcceptedInviteElsewhere, 
            acceptedInvites: acceptedInvitesElsewhere.map(invite => ({
                id: invite.id,
                event: invite.event,
                eventId: invite.eventId,
                formatCode: invite.formatCode,
                rank: invite.rank
            }))
        }
    });

}

export async function getDashboardRollDownAlerts(req: Request, res: Response): Promise<void> {
    const { eventTimeline } = req.query;

    if (!eventTimeline) {
        throw new BadRequestError("Missing required query parameter: eventTimeline");
    }

    const eventTimelineData = await getDBEventTimelineByEventYear(eventTimeline as string);
    if (!eventTimelineData) {
        throw new NotFoundError("Event Timeline not found");
    }

    const allResults = await getDBAllPlayerResultsByTimeline(eventTimelineData.id);

    const groups: Record<string, { eventId: string; eventName: string; formatCode: string; results: typeof allResults }> = {};

    allResults.forEach(row => {
        const key = `${row.eventId}-${row.formatCode}`;
        if (!groups[key]) {
            groups[key] = {
                eventId: row.eventId,
                eventName: row.eventName,
                formatCode: row.formatCode,
                results: []
            };
        }
        groups[key].results.push(row);
    });

    const flaggedFormats = [];

    // 3. Scan our historical groups for missing 4th-place slot passes
    for (const key in groups) {
        const { eventId, eventName, formatCode, results } = groups[key];

        // Isolate 2nd and 3rd place finishes
        const transferableSlots = results.filter(r => (r.rank === 2 || r.rank === 3) && r.isQualified);

        // Did either 2nd or 3rd choose NOT to lock in their invite here?
        const transferableSlotsVacated = transferableSlots.filter(r => !r.invTakenHere).length;

        // Is 4th place sitting on isQualified = false?
        const eligibleFourthPlace = results.find(r => r.rank === 4 && !r.isQualified);

        // If an invite was vacated by 2nd/3rd, but 4th hasn't been qualified yet, flag it!
        if (transferableSlotsVacated > 0 && eligibleFourthPlace) {
            flaggedFormats.push({
                eventId,
                eventName,
                formatCode,
                vacatedCount: transferableSlotsVacated,
                eligiblePlayer: {
                    playerResultId: eligibleFourthPlace.id,
                    bushiNaviId: eligibleFourthPlace.bushiNaviId,
                    name: eligibleFourthPlace.playerName,
                    rank: eligibleFourthPlace.rank,
                }
            });
        }
    }

    respondWithJSON(res, 200, {
        data: {
            timelineYear: eventTimeline,
            totalAlertsCount: flaggedFormats.length,
            alerts: flaggedFormats
        }
    });


}
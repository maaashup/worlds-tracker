import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBEventSeries, getDBAllEventSeriesByTLYear, getDBEventSeries, getDBEventSeriesById } from "../db/query/eventSeries.js";
import { getDBEventTypeByCode } from "../db/query/eventType.js";
import { getDBEventTimelineByEventYear } from "../db/query/eventTimeline.js";
import { getDBRegionByCode } from "../db/query/region.js";




export async function createEventSeries(req: Request, res: Response): Promise<void> {
    const { name, eventType, regionCode, eventTimeline, formats, date } = req.body;

    if (!name || !eventType || !regionCode || !eventTimeline || !formats || !date) {
        throw new BadRequestError("Missing one of the required fields: name, eventType, region, eventTimeline, formats, date");
    }

    //Make sure that event-type is either: BCS, BSF, PW. -> If false, throw error.
    const checkEventType = await getDBEventTypeByCode(eventType);
    if (!checkEventType) {
        throw new BadRequestError("This event type is not valid.");
    }

    const checkRegion = await getDBRegionByCode(regionCode);
    if (!checkRegion) {
        throw new BadRequestError("This region is not valid. Valid regions are: EU, NA, AO");
    }

    const validEventTimeline = await getDBEventTimelineByEventYear(eventTimeline);
    if (!validEventTimeline) {
        throw new BadRequestError("This event timeline does not exist.");
    }

    // respondWithJSON(res, 201, {name: name, eventType: checkEventType.code, region, eventTimeline: validEventTimeline.id, date});

    const newEventSeries = await addDBEventSeries({ name, eventTypeId: checkEventType.id, regionCode: checkRegion.code , eventTimelineId: validEventTimeline.id, formats, date });
    if (!newEventSeries) {
        throw new BadRequestError("Failed to create event series");
    }

    respondWithJSON(res, 201, newEventSeries);
}

export async function getAllEventSeries(req: Request, res: Response): Promise<void> {
    const allEventSeries =  await getDBEventSeries();

    return respondWithJSON(res, 200, allEventSeries);

}

export async function getAllEventSeriesForTimelineYear(req: Request, res: Response) {
    const eventTimelineYear = req.params.id as string;
    if (!eventTimelineYear) {
        throw new BadRequestError("Missing required field: eventTimelineYear");
    }

    const eventTimelineData = await getDBEventTimelineByEventYear(eventTimelineYear);
    if (!eventTimelineData) {
        throw new NotFoundError("No event timeline found for the given year");
    }

    const response = await getDBAllEventSeriesByTLYear(eventTimelineData.id);

    return respondWithJSON(res, 200, response);
}

export async function getEventSummary(req: Request, res: Response) {
    const payload = (req.method === 'GET' ? req.query : req.body) as {
        eventId?: string;
    };

    if (!payload.eventId) {
        throw new BadRequestError("Missing required field: eventId");
    }

    const summary = await getDBEventSeriesById(payload.eventId);
    if (!summary) {
        throw new NotFoundError("No event found");
    }

    return respondWithJSON(res, 200, {data: summary});
}
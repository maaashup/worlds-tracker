import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { BadRequestError } from "../middleware/middlewareLogging.js";

import { addDBEventSeries, getDBEventSeries, getDBEventSeriesById } from "../db/query/eventSeries.js";
import { getDBEventTypeByCode } from "../db/query/eventType.js";
import { getDBEventTimelineByEventYear } from "../db/query/eventTimeline.js";




export async function createEventSeries(req: Request, res: Response): Promise<void> {
    const { name, eventType, region, eventTimeline, date } = req.body;

    if (!name || !eventType || !region || !eventTimeline || !date) {
        throw new BadRequestError("Missing one of the required fields: name, eventType, region, eventTimeline, date");
    }

    //Make sure that event-type is either: BCS, BSF, PW. -> If false, throw error.
    const checkEventType = await getDBEventTypeByCode(eventType);
    if (!checkEventType) {
        throw new BadRequestError("This event type is not valid.");
    }

    const validRegion = ["EU", "NA", "AO"].includes(region);
    if (!validRegion) {
        throw new BadRequestError("This region is not valid. Valid regions are: EU, NA, AO");
    }

    const validEventTimeline = await getDBEventTimelineByEventYear(eventTimeline);
    if (!validEventTimeline) {
        throw new BadRequestError("This event timeline does not exist.");
    }

    // respondWithJSON(res, 201, {name: name, eventType: checkEventType.code, region, eventTimeline: validEventTimeline.id, date});

    const newEventSeries = await addDBEventSeries({ name, eventTypeId: checkEventType.id, region, eventTimelineId: validEventTimeline.id, date });
    if (!newEventSeries) {
        throw new BadRequestError("Failed to create event series");
    }

    respondWithJSON(res, 201, newEventSeries);
}
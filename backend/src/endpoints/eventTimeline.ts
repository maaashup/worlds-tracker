import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { NotFoundError, BadRequestError } from "../middleware/middlewareLogging.js";

import { addEventTimeline, getEventTimelines, getEventTimelineById } from "../db/query/eventTimeline.js";

export async function createEventTimeline(req: Request, res: Response) {
    let { eventYear, startDate, endDate } = req.body;

    if (!eventYear || !startDate || !endDate) {
        throw new NotFoundError("Missing one of the required fields: eventYear, startDate, endDate");
    }

    const newTimeline = await addEventTimeline({ eventYear, startDate, endDate });
    if (!newTimeline) {
        throw new BadRequestError("Failed to create event timeline");
    }

    return respondWithJSON(res, 201, newTimeline);
}
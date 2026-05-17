import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { NotFoundError, BadRequestError } from "../middleware/middlewareLogging.js";

import { addDBEventTimeline, getDBEventTimelines, getDBEventTimelineById, getDBEventTimelineByEventYear } from "../db/query/eventTimeline.js";

export async function createEventTimeline(req: Request, res: Response) {
    let { eventYear, startDate, endDate } = req.body;

    if (!eventYear || !startDate || !endDate) {
        throw new NotFoundError("Missing one of the required fields: eventYear, startDate, endDate");
    }

    const checkEventYear = await getDBEventTimelineByEventYear(eventYear);
    if (checkEventYear) {
        throw new BadRequestError(`Event timeline for event year ${eventYear} already exists`);
    }

    const newTimeline = await addDBEventTimeline({ eventYear, startDate, endDate });
    if (!newTimeline) {
        throw new BadRequestError("Failed to create event timeline");
    }

    respondWithJSON(res, 201, newTimeline);
}

export async function getAllEventTimelines(req: Request, res: Response) {
    const timelines = await getDBEventTimelines();

    respondWithJSON(res, 200, timelines);
}

export async function getEventTimelineByID(req: Request, res: Response) {
    const id = req.params.id as string;
    const timeline = await getDBEventTimelineById(id);
    if (!timeline) {
        throw new NotFoundError(`Event timeline with id ${id} not found`);
    }

    respondWithJSON(res, 200, timeline);
}

export async function getEventTimelineByEventYear(req: Request, res: Response) {
    const eventYear = req.params.eventYear as string;
    const timeline = await getDBEventTimelineByEventYear(eventYear);
    if (!timeline) {
        throw new NotFoundError(`Event timeline with event year ${eventYear} not found`);
    }

    respondWithJSON(res, 200, timeline);
}
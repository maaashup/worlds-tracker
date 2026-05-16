import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";
import { BadRequestError } from "../middleware/middlewareLogging.js";

import { addEventSeries, getEventSeries, getEventSeriesById } from "../db/query/eventSeries.js";




export async function createEventSeries(req: Request, res: Response) {
    const { name, eventType, region, eventTimelineId, date } = req.body;

    if (!name || !eventType || !region || !eventTimelineId || !date) {
        throw new BadRequestError("Missing one of the required fields: name, eventType, region, eventTimelineId, date");
    }

    //Make sure that event-type is either: BCS, BSF, PW. -> If false, throw error.
    
}
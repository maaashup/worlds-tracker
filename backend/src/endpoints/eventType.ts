import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBEventType, getDBEventTypes, getDBEventTypeById, getDBEventTypeByCode } from "../db/query/eventType.js";

export async function createEventType(req: Request, res: Response): Promise<void> {
    
    const { code, fullName, isActive } = req.body;

    if (!code || !fullName || isActive === undefined) {
        throw new BadRequestError("Missing one of the required fields: code, fullName, isActive");
    }

    const username = req.user?.username || "System";

    const addEventType = await addDBEventType({ code, fullName, isActive, createdBy: username, updatedBy: username });
    if (!addEventType) {
        throw new BadRequestError("Failed to create event type");
    }

    respondWithJSON(res, 201, addEventType);

}

export async function getAllEventTypes(req: Request, res: Response) {
    const eventTypes = await getDBEventTypes();

    respondWithJSON(res, 200, eventTypes);
}

export async function getEventTypeByCode(req: Request, res: Response) {
    const code = req.params.code as string;
    const eventType = await getDBEventTypeByCode(code);
    if (!eventType) {
        throw new NotFoundError(`Event type with code ${code} not found`);
    }

    respondWithJSON(res, 200, eventType);
}
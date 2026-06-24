import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBFormat, getDBFormats, getDBFormatById, getDBFormatByName } from "../db/query/format.js";

export async function createFormat(req: Request, res: Response): Promise<void> {

    const { name, isActive } = req.body; 

    if (!name || isActive === undefined) {
        throw new BadRequestError("Missing required fields");
    }
    const checkFormat = await getDBFormatByName(name);
    if (checkFormat) {
        throw new BadRequestError("Format with this name already exists");
    }

    const addFormat = await addDBFormat({ name, isActive });
    if (!addFormat) {
        throw new NotFoundError("Failed to create format");
    }

    respondWithJSON(res, 201, addFormat);
}

export async function getFormats(req: Request, res: Response): Promise<void> {
    const formats = await getDBFormats();

    respondWithJSON(res, 200, formats);
}

export async function getFormatById(req: Request, res: Response): Promise<void> {
    const id  = req.params.id as string;
    const format = await getDBFormatById(id);
    if (!format) {
        throw new NotFoundError("Format not found");
    }
    
    respondWithJSON(res, 200, format);
}


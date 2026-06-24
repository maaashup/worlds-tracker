import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { config } from "../config.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBFormat, getDBFormats, getDBFormatById, getDBFormatByName, getDBFormatByCode } from "../db/query/format.js";

export async function createFormat(req: Request, res: Response): Promise<void> {

    const { name, code, isActive } = req.body; 

    if (!name || !code || isActive === undefined) {
        throw new BadRequestError("Missing required fields");
    }
    const checkFormat = await getDBFormatByName(name);
    if (checkFormat) {
        throw new BadRequestError("Format with this name already exists");
    }

    const checkCode = await getDBFormatByCode(code);
    if (checkCode) {
        throw new BadRequestError("Format with this code already exists");
    }

    const addFormat = await addDBFormat({ name, code, isActive });
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

export async function getFormatByCode(req: Request, res: Response): Promise<void> {
    const code  = req.params.code as string;
    const format = await getDBFormatByCode(code);
    if (!format) {
        throw new NotFoundError("Format not found");
    }
    
    respondWithJSON(res, 200, format);
}


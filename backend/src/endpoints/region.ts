import { Request, Response } from "express";

import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { BadRequestError, NotFoundError } from "../middleware/middlewareLogging.js";

import { addDBRegion, getDBRegions, getDBRegionByCode } from "../db/query/region.js";


export async function createRegion(req: Request, res: Response): Promise<void> {
    const { code, fullRegionName, isActive } = req.body;
    if (!code || !fullRegionName || !isActive) {
        throw new BadRequestError("Missing required fields");
    }

    const addRegion = await addDBRegion({ code, fullRegionName, isActive });
    if (!addRegion) {
        throw new NotFoundError("Failed to create region");
    }

    respondWithJSON(res, 201, addRegion);
}

export async function getRegions(req: Request, res: Response): Promise<void> {
    const regions = await getDBRegions();
    respondWithJSON(res, 200, regions);
}

export async function getRegionByCode(req: Request, res: Response): Promise<void> {
    const code = req.params.code as string;
    const region = await getDBRegionByCode(code);
    if (!region) {
        throw new NotFoundError("Region not found");
    }

    respondWithJSON(res, 200, region);
}
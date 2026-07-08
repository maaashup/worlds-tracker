import { NextFunction, Request, Response } from "express";

import { getDBUserById } from "../db/query/users.js";
import { ForbiddenError, UnauthorisedError } from "./middlewareLogging.js";

export async function middlewareRequireOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.userId) {
            throw new UnauthorisedError("Missing authenticated user");
        }

        const user = await getDBUserById(req.userId);
        if (!user) {
            throw new UnauthorisedError("Authenticated user not found");
        }

        if (!user.isOwner) {
            throw new ForbiddenError("Owner privileges required");
        }

        next();
    } catch (error) {
        next(error);
    }
}

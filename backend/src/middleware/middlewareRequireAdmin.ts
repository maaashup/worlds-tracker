import { NextFunction, Request, Response } from "express";

import { getDBUserById } from "../db/query/users.js";
import { ForbiddenError, UnauthorisedError } from "./middlewareLogging.js";

export async function middlewareRequireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.userId) {
            throw new UnauthorisedError("Missing authenticated user");
        }

        const user = await getDBUserById(req.userId);
        if (!user) {
            throw new UnauthorisedError("Authenticated user not found");
        }

        if (!user.isAdmin) {
            throw new ForbiddenError("Admin privileges required");
        }

        next();
    } catch (error) {
        next(error);
    }
}

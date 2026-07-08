import { NextFunction, Request, Response } from "express";

import { getDBRefreshTokenByToken } from "../db/query/refreshTokens.js";
import { UnauthorisedError } from "./middlewareLogging.js";

export async function middlewareIsValidRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorisedError("Missing refresh token");
        }

        const storedRefreshToken = await getDBRefreshTokenByToken(refreshToken);
        const currentDate = new Date();

        if (!storedRefreshToken || currentDate > storedRefreshToken.expiresAt || storedRefreshToken.revokedAt != null) {
            throw new UnauthorisedError("Invalid refresh token");
        }

        req.refreshToken = refreshToken;
        req.userId = storedRefreshToken.userId;
        next();
    } catch (error) {
        next(error);
    }
}
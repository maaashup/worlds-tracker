import { Request, Response } from "express";

import { makeJWT } from "../helperfunctions/auth.js";
import { config } from "../config.js";

import { revokeDBRefreshToken } from "../db/query/refreshTokens.js";
import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";
import { UnauthorisedError } from "../middleware/middlewareLogging.js";

export async function refreshToken(req: Request, res: Response): Promise<void> {
    if (!req.userId) {
        throw new UnauthorisedError("Invalid refresh token");
    }

    const newToken = makeJWT(req.userId, 3600, config.secretKey);

    respondWithJSON(res, 200, { data: { token: newToken } });
}

export async function revokeToken(req: Request, res: Response): Promise<void> {
    if (!req.refreshToken) {
        throw new UnauthorisedError("Invalid refresh token");
    }

    const currentDate = new Date();

    const storedToken = await revokeDBRefreshToken(req.refreshToken, currentDate);
    if (!storedToken || currentDate > storedToken.expiresAt) {
        return respondWithJSON(res, 401, { data: { error: "Invalid or expired refresh token" } });
    }

    return respondWithJSON(res, 204, {});
}
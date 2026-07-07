import { Request, Response } from "express";

import { makeJWT, getBearerToken } from "../helperfunctions/auth.js";
import { config } from "../config.js";

import { getDBRefreshTokenByToken, revokeDBRefreshToken } from "../db/query/refreshTokens.js";
import { respondWithJSON } from "../helperfunctions/respondWithJSON.js";

export async function refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = getBearerToken(req);

    const currentDate = new Date();

    const storedToken = await getDBRefreshTokenByToken(refreshToken);
    if (!storedToken || currentDate > storedToken.expiresAt) {
        return respondWithJSON(res, 401, { data: { error: "Invalid or expired refresh token" } });
    }

    const newToken = makeJWT(storedToken.userId, 3600, config.secretKey);

    respondWithJSON(res, 200, { data: { token: newToken } });
}

export async function revokeToken(req: Request, res: Response): Promise<void> {
    const refreshToken = getBearerToken(req);

    const currentDate = new Date();

    const storedToken = await revokeDBRefreshToken(refreshToken, currentDate);
    if (!storedToken || currentDate > storedToken.expiresAt) {
        return respondWithJSON(res, 401, { data: { error: "Invalid or expired refresh token" } });
    }

    return respondWithJSON(res, 204, {});
}
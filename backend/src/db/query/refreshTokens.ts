import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { RefreshTokens, refreshTokens } from "../schema.js";

export async function createDBRefreshToken(token: RefreshTokens) {
    const [result] = await db.insert(refreshTokens).values(token).returning();
    return result;
}

export async function getDBRefreshTokenByToken(token: string) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
    return result;
}

export async function revokeDBRefreshToken(token: string, revokedAt: Date) {
    const [result] = await db.update(refreshTokens).set({ revokedAt: revokedAt }).where(eq(refreshTokens.token, token)).returning();
    return result;
}
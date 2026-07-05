import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { playerResults , type PlayerResults, eventSeries, type EventSeries  } from "../schema.js";

export async function addDBPlayerResults(player: PlayerResults) {
    const [result] = await db.insert(playerResults).values(player).returning();
    return result;
}

export async function getDBPlayerResults() {
    const result = await db.select().from(playerResults);
    return result;
}

export async function getDBPlayerResultsById(id: string) {
    const [result] = await db.select().from(playerResults).where(eq(playerResults.id, id));
    return result;
}

export async function getDBPlayerResultsByNaviId(naviId: string) {
    const [result] = await db.select().from(playerResults).where(eq(playerResults.bushiNaviId, naviId));
    return result;
}

export async function getDBPlayerResultsForEventSeries(eventSeriesId: string) {
    const result = await db.select({
                                    id: playerResults.id,
                                    bushiNaviId: playerResults.bushiNaviId,
                                    playerName: playerResults.playerName,
                                    formatCode: playerResults.formatCode,
                                    decklog: playerResults.decklog,
                                    rank: playerResults.rank,
                                    isSponsored: playerResults.isSponsored,
                                    isFormComplete: playerResults.isFormComplete,
                                    isQualified: playerResults.isQualified,
                                    invTakenHere: playerResults.invTakenHere
                                })
                    .from(playerResults)
                    .innerJoin(eventSeries, eq(playerResults.eventSeriesId, eventSeries.id))
                    .where(eq(eventSeries.id, eventSeriesId));
    return result;
}

export async function updateDBPlayerResults(id: string, player: Partial<PlayerResults>) {
    const [result] = await db.update(playerResults).set(player).where(eq(playerResults.id, id)).returning();
    return result;
}

export async function deleteDBPlayerResults(id: string) {
    const [result] = await db.delete(playerResults).where(eq(playerResults.id, id)).returning();
    return result;
}
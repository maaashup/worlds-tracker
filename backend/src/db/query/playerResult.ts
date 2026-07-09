import { eq, and } from "drizzle-orm";

import { db } from "../index.js";
import { playerResults , type PlayerResults, eventSeries, type EventSeries, eventTimeline, eventType  } from "../schema.js";

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

export async function findDBAllInvitesForPlayer(bushiNaviId: string, eventTimelineId: string) {
    const result = await db.select({
                                id: playerResults.id,
                                bushiNaviId: playerResults.bushiNaviId,
                                playerName: playerResults.playerName,
                                rank: playerResults.rank,
                                formatCode: playerResults.formatCode,
                                invTakenHere: playerResults.invTakenHere,
                                isQualified: playerResults.isQualified,
                                event: eventSeries.name,
                                eventId: eventSeries.id,
                                eventType: eventType.code,
                                eventTypeId: eventType.id,
                            })
                           .from(playerResults)
                           .innerJoin(eventSeries, eq(playerResults.eventSeriesId, eventSeries.id))
                           .innerJoin(eventTimeline, eq(eventSeries.eventTimelineId, eventTimeline.id))
                           .innerJoin(eventType, eq(eventSeries.eventTypeId, eventType.id))
                           .where(and(eq(playerResults.bushiNaviId, bushiNaviId), eq(eventTimeline.id, eventTimelineId)));
    return result;
}

export async function getDBAllPlayerResultsByTimeline(eventTimelineId: string) {
    const result = await db.select({
                            id: playerResults.id,
                            bushiNaviId: playerResults.bushiNaviId,
                            playerName: playerResults.playerName,
                            rank: playerResults.rank,
                            formatCode: playerResults.formatCode,
                            invTakenHere: playerResults.invTakenHere,
                            isQualified: playerResults.isQualified,
                            eventName: eventSeries.name,
                            eventId: eventSeries.id
                        })
                           .from(playerResults)
                           .innerJoin(eventSeries, eq(playerResults.eventSeriesId, eventSeries.id))
                           .innerJoin(eventTimeline, eq(eventSeries.eventTimelineId, eventTimeline.id))
                           .where(eq(eventTimeline.id, eventTimelineId));
    return result;
}
import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { playerResults , type PlayerResults  } from "../schema.js";

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
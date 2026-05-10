import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { playerResults , type PlayerResults  } from "../schema.js";

export async function addPlayerResults(player: PlayerResults) {
    const [result] = await db.insert(playerResults).values(player).returning();
    return result;
}

export async function getPlayerResults() {
    const result = await db.select().from(playerResults);
    return result;
}

export async function getPlayerResultsById(id: string) {
    const [result] = await db.select().from(playerResults).where(eq(playerResults.id, id));
    return result;
}
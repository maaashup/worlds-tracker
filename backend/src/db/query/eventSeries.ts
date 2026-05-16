import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { eventSeries, type EventSeries } from "../schema.js";

export async function addDBEventSeries(event: EventSeries) {
    const [result] = await db
        .insert(eventSeries)
        .values(event)
        .returning();
    
    return result;
}

export async function getDBEventSeries() {
    const result = await db.select().from(eventSeries);
    return result;
}

export async function getDBEventSeriesById(id: string) {
    const [result] = await db.select().from(eventSeries).where(eq(eventSeries.id, id));
    return result;
}
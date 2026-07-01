import { eq, and } from "drizzle-orm";

import { db } from "../index.js";
import { eventSeries, eventType, type EventSeries } from "../schema.js";

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

export async function getDBEventSeriesByName(name: string, eventTypeId: string, eventTimelineId: string) {
    const [result] = await db.select().from(eventSeries).where(and(eq(eventSeries.name, name), eq(eventSeries.eventTypeId, eventTypeId), eq(eventSeries.eventTimelineId, eventTimelineId)));
    return result;
}

export async function getDBAllEventSeriesByTLYear(eventTimelineId: string) {
    const result = await db.select({id: eventSeries.id, name: eventSeries.name, regionCode: eventSeries.regionCode, eventDate: eventSeries.date, eventType: eventType.code, formats: eventSeries.formats})
                           .from(eventSeries)
                           .innerJoin(eventType, eq(eventType.id, eventSeries.eventTypeId))
                           .where(eq(eventSeries.eventTimelineId, eventTimelineId)).orderBy(eventSeries.date);
    return result;
}
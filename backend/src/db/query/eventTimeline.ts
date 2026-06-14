import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { eventTimeline, NewEventTimeline } from "../schema.js";

export async function addDBEventTimeline(event: NewEventTimeline) {
    const [result] = await db.insert(eventTimeline).values(event).returning();
    return result;
}

export async function getDBEventTimelines() {
    const result = await db.select().from(eventTimeline);
    return result;
}

export async function getDBEventTimelineById(id: string) {
    const [result] = await db.select().from(eventTimeline).where(eq(eventTimeline.id, id));
    return result;
}

export async function getDBEventTimelineByEventYear(eventYear: string) {
    const [result] = await db.select().from(eventTimeline).where(eq(eventTimeline.eventYear, eventYear));
    return result;
}
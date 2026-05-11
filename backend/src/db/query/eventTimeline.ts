import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { eventTimeline, NewEventTimeline } from "../schema.js";

export async function addEventTimeline(event: NewEventTimeline) {
    const [result] = await db.insert(eventTimeline).values(event).returning();
    return result;
}

export async function getEventTimelines() {
    const result = await db.select().from(eventTimeline);
    return result;
}

export async function getEventTimelineById(id: string) {
    const [result] = await db.select().from(eventTimeline).where(eq(eventTimeline.id, id));
    return result;
}

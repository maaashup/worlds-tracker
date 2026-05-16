import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { eventType , type EventType  } from "../schema.js";


export async function addDBEventType(event: EventType) {
    const [result] = await db.insert(eventType).values(event).returning();
    return result;
}

export async function getDBEventTypes() {
    const result = await db.select().from(eventType);
    return result;
}

export async function getDBEventTypeById(id: string) {
    const [result] = await db.select().from(eventType).where(eq(eventType.id, id));
    return result;
}

export async function getDBEventTypeByCode(code: string) {
    const [result] = await db.select().from(eventType).where(eq(eventType.code, code));
    return result;
}
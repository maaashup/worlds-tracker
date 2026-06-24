import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { format, type Format } from "../schema.js";

export async function addDBFormat(formatData: Format) {
    const [result] = await db.insert(format).values(formatData).returning();
    return result;
}

export async function getDBFormats() {
    const result = await db.select().from(format);
    return result;
}

export async function getDBFormatById(id: string) {
    const [result] = await db.select().from(format).where(eq(format.id, id));
    return result;
}

export async function getDBFormatByName(name: string) {
    const [result] = await db.select().from(format).where(eq(format.name, name));
    return result;
}

export async function getDBFormatByCode(code: string) {
    const [result] = await db.select().from(format).where(eq(format.code, code));
    return result;
}
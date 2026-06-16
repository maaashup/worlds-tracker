import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { regions , type Regions  } from "../schema.js";


export async function addDBRegion(region: Regions) {
    const [result] = await db.insert(regions).values(region).returning();
    return result;
}

export async function getDBRegions() {
    const result = await db.select().from(regions);
    return result;
}

export async function getDBRegionByCode(code: string) {
    const [result] = await db.select().from(regions).where(eq(regions.code, code));
    return result;
}
import { db } from "../index.js";
import { Users, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createDBUser(user: Users) {
    const [result] = await db.insert(users).values(user).returning();
    return result;
}

export async function getDBUserByUsername(username: string) {
    const [result] = await db.select().from(users).where(eq(users.username, username));
    return result;
}

export async function updateDBUser(userId: string, updatedFields: Partial<Users>) {
    const [result] = await db.update(users).set(updatedFields).where(eq(users.id, userId)).returning();
    return result;
}

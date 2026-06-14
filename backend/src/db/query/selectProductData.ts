import { sql } from "drizzle-orm/sql/sql";
import { db } from "../index.js";
import { products } from "../schema.js";

export async function readProducts() {
    const result = await db.execute(sql`SELECT * FROM products`);
    return result;
}
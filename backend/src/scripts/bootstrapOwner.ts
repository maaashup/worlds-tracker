import { eq } from "drizzle-orm";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { createDBUser, getDBUserByUsername } from "../db/query/users.js";
import { hashPassword } from "../helperfunctions/auth.js";

async function main() {
    const ownerUsername = envOrThrow("BOOTSTRAP_OWNER_USERNAME");
    const ownerPassword = envOrThrow("BOOTSTRAP_OWNER_PASSWORD");

    const existingOwners = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.isOwner, true));

    if (existingOwners.length > 0) {
        console.log("Bootstrap skipped: owner already exists.");
        return;
    }

    const existingUser = await getDBUserByUsername(ownerUsername);
    if (existingUser) {
        throw new Error("Bootstrap failed: BOOTSTRAP_OWNER_USERNAME already exists.");
    }

    const passwordHash = await hashPassword(ownerPassword);

    await createDBUser({
        username: ownerUsername,
        passwordHash,
        firstLogin: true,
        isAdmin: true,
        isOwner: true,
        createdBy: "bootstrap",
        updatedBy: "bootstrap",
    });

    console.log(`Bootstrap success: owner user '${ownerUsername}' created.`);
}

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} is required`);
    }

    return value;
}

main()
    .catch((error) => {
        console.error("Owner bootstrap failed:", error);
        process.exitCode = 1;
    })
    .finally(() => {
        process.exit(process.exitCode ?? 0);
    });

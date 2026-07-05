import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from "postgres";

import * as schema from "./schema.js";
import { config } from "../config.js";

const conn = postgres({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export const db = drizzle(conn, { schema });
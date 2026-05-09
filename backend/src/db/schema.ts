import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow()
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    createdAt,
    updatedAt,
  }
)
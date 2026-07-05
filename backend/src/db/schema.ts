import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  date,
  serial,
} from "drizzle-orm/pg-core"

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow()
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())
  
// eventTimeline Table: Represents a timeline of events, such as a tournament series or season. It includes fields for the event year, start and end dates, and timestamps for creation and updates.
export const eventTimeline = pgTable("eventTimeline", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventYear: text("event_year").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  createdAt,
  updatedAt,
});

export type NewEventTimeline = typeof eventTimeline.$inferInsert

// eventSeries Table: Represents a series of events within a timeline, such as individual tournaments or competitions. It includes fields for the event type, region, date, and a foreign key reference to the event timeline it belongs to.
export const eventSeries = pgTable("eventSeries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  eventTypeId: uuid("event_type_id")
    .notNull()
    .references(() => eventType.id, { onDelete: "cascade" }),
  regionCode: text("region_code")
    .notNull()
    .references(() => regions.code, { onDelete: "cascade" }),
  date: date("event_date").notNull(),
  eventTimelineId: uuid("event_timeline_id")
    .notNull()
    .references(() => eventTimeline.id, { onDelete: "cascade" }),
  formats: text("formats").array().notNull().default(['D', 'WS', 'SVE']),
  createdAt,
  updatedAt,
});

export type EventSeries = typeof eventSeries.$inferInsert


// format Table: Represents the format of a tournament or competition, such as Standard, Modern, or Commander. It includes fields for the format name, active status, and timestamps for creation and updates.
export const format = pgTable("format", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  isActive: boolean("is_active").notNull(),
  createdAt,
  updatedAt,
});

export type Format = typeof format.$inferInsert

// playerResults Table: Represents the results of players in a tournament or competition. It includes fields for the player's name, rank, sponsorship status, form completion status, invitation status, and foreign key references to the format and event series they participated in.
export const playerResults = pgTable("playerResults", {
  id: uuid("id").primaryKey().defaultRandom(),
  bushiNaviId: text("bushi_navi_id").notNull(),
  playerName: text("player_name").notNull(),
  decklog: text("decklog"),
  formatCode: text("format_code")
    .notNull()
    .references(() => format.code, { onDelete: "cascade" }),
  rank: integer("rank").notNull(),
  isSponsored: boolean("is_sponsored").notNull(),
  isFormComplete: boolean("is_form_complete").notNull(),
  invTakenHere: boolean("inv_taken_here").notNull(),
  isQualified: boolean("is_qualified").notNull(),
  eventTypeId: uuid("event_type_id")
    .notNull()
    .references(() => eventType.id, { onDelete: "cascade" }),
  eventSeriesId: uuid("event_series_id")
    .notNull()
    .references(() => eventSeries.id, { onDelete: "cascade" }),
  regionCode: text("region_code")
    .notNull()
    .references(() => regions.code, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export type PlayerResults = typeof playerResults.$inferInsert

// eventType Table: Represents the type of event.

export const eventType = pgTable("eventType", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  fullName: text("full_name").notNull(),
  isActive: boolean("is_active").notNull(),
  createdAt,
  updatedAt,
});

export type EventType = typeof eventType.$inferInsert

//region Table: Lists all the legal regions

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  fullRegionName: text("full_region_name").notNull(),
  isActive: boolean("is_active").notNull(),
  createdAt,
  updatedAt,
});

export type Regions = typeof regions.$inferInsert
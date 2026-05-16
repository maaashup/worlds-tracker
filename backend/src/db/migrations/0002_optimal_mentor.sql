CREATE TABLE "eventType" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "eventSeries" ADD COLUMN "event_type_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "eventSeries" ADD CONSTRAINT "eventSeries_event_type_id_eventType_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."eventType"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventSeries" DROP COLUMN "event_type";
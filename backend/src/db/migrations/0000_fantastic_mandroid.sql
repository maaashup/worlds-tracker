CREATE TABLE "eventSeries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"event_region" text NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"event_timeline_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventTimeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_year" text NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "format" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"active" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playerResults" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bushi_navi_id" text NOT NULL,
	"player_name" text NOT NULL,
	"format_id" uuid NOT NULL,
	"rank" integer NOT NULL,
	"is_sponsored" boolean NOT NULL,
	"is_form_complete" boolean NOT NULL,
	"inv_taken_here" boolean NOT NULL,
	"event_series_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "eventSeries" ADD CONSTRAINT "eventSeries_event_timeline_id_eventTimeline_id_fk" FOREIGN KEY ("event_timeline_id") REFERENCES "public"."eventTimeline"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResults" ADD CONSTRAINT "playerResults_format_id_format_id_fk" FOREIGN KEY ("format_id") REFERENCES "public"."format"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResults" ADD CONSTRAINT "playerResults_event_series_id_eventSeries_id_fk" FOREIGN KEY ("event_series_id") REFERENCES "public"."eventSeries"("id") ON DELETE cascade ON UPDATE no action;
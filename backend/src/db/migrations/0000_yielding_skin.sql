CREATE TABLE "eventSeries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"event_type_id" uuid NOT NULL,
	"region_code" text NOT NULL,
	"event_date" date NOT NULL,
	"event_timeline_id" uuid NOT NULL,
	"formats" text[] DEFAULT '{"D","WS","SVE"}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventTimeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_year" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventType" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"full_name" text NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL,
	CONSTRAINT "eventType_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "format" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL,
	CONSTRAINT "format_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "playerResults" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bushi_navi_id" text NOT NULL,
	"player_name" text NOT NULL,
	"decklog" text,
	"format_code" text NOT NULL,
	"rank" integer NOT NULL,
	"is_sponsored" boolean NOT NULL,
	"is_form_complete" boolean NOT NULL,
	"inv_taken_here" boolean NOT NULL,
	"is_qualified" boolean NOT NULL,
	"event_type_id" uuid NOT NULL,
	"event_series_id" uuid NOT NULL,
	"region_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"full_region_name" text NOT NULL,
	"is_active" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL,
	CONSTRAINT "regions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_login" boolean DEFAULT true NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "eventSeries" ADD CONSTRAINT "eventSeries_event_type_id_eventType_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."eventType"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventSeries" ADD CONSTRAINT "eventSeries_region_code_regions_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventSeries" ADD CONSTRAINT "eventSeries_event_timeline_id_eventTimeline_id_fk" FOREIGN KEY ("event_timeline_id") REFERENCES "public"."eventTimeline"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResults" ADD CONSTRAINT "playerResults_format_code_format_code_fk" FOREIGN KEY ("format_code") REFERENCES "public"."format"("code") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResults" ADD CONSTRAINT "playerResults_event_type_id_eventType_id_fk" FOREIGN KEY ("event_type_id") REFERENCES "public"."eventType"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResults" ADD CONSTRAINT "playerResults_event_series_id_eventSeries_id_fk" FOREIGN KEY ("event_series_id") REFERENCES "public"."eventSeries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResults" ADD CONSTRAINT "playerResults_region_code_regions_code_fk" FOREIGN KEY ("region_code") REFERENCES "public"."regions"("code") ON DELETE cascade ON UPDATE no action;
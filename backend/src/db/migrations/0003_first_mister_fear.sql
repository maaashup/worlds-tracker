ALTER TABLE "eventType" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "eventType" ADD COLUMN "full_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "eventType" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "eventType" ADD CONSTRAINT "eventType_code_unique" UNIQUE("code");
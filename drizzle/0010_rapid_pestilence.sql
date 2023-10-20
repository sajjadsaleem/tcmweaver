CREATE TABLE IF NOT EXISTS "filters" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
ALTER TABLE "Dataset" RENAME TO "dataset";--> statement-breakpoint
ALTER TABLE "basic_vault" ALTER COLUMN "filename" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "basic_vault" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "label" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "label" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "full_name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "dataset" ALTER COLUMN "filename" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "dataset" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "filters" ("filename");
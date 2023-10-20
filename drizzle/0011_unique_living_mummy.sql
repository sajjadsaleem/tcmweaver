CREATE TABLE IF NOT EXISTS "premium_vault" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "standard_vault" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "premium_vault" ("filename");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "standard_vault" ("filename");
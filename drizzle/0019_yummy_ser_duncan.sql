CREATE TABLE IF NOT EXISTS "table39" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "table40" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "table39" ("filename");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "table40" ("filename");
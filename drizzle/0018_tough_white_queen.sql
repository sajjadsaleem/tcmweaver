CREATE TABLE IF NOT EXISTS "table38" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "table38" ("filename");
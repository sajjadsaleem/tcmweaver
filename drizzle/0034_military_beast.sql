CREATE TABLE IF NOT EXISTS "table88" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text,
	"content" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "table88" ("filename");
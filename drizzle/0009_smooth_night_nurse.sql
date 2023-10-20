CREATE TABLE IF NOT EXISTS "basic_vault" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(256),
	"content" varchar(1024)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "basic_vault" ("filename");
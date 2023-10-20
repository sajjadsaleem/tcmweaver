CREATE TABLE IF NOT EXISTS "vaults" (
	"id" serial PRIMARY KEY NOT NULL,
	"vault_name" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vault_name" ON "vaults" ("vault_name");
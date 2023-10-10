CREATE TABLE IF NOT EXISTS "dataset" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(256),
	"content" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(256),
	"name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rolePermissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer,
	"permission_id" integer,
	CONSTRAINT "rolePermissions_role_id_permission_id_unique" UNIQUE("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" varchar(256),
	"name" varchar(256)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "filename" ON "dataset" ("filename");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name" ON "permissions" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name" ON "roles" ("name");
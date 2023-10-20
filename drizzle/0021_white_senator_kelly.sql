CREATE TABLE IF NOT EXISTS "vaultPackages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"package_id" integer,
	CONSTRAINT "vaultPackages_user_id_package_id_unique" UNIQUE("user_id","package_id")
);
--> statement-breakpoint
ALTER TABLE "subscriptions" RENAME TO "userPackages";--> statement-breakpoint
ALTER TABLE "userPackages" DROP CONSTRAINT "subscriptions_user_id_package_id_unique";--> statement-breakpoint
ALTER TABLE "userPackages" ADD CONSTRAINT "userPackages_user_id_package_id_unique" UNIQUE("user_id","package_id");
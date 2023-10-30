ALTER TABLE "packages" RENAME COLUMN "package_name" TO "name";--> statement-breakpoint
ALTER TABLE "packages" RENAME COLUMN "package_price" TO "price";--> statement-breakpoint
ALTER TABLE "packages" DROP CONSTRAINT "packages_package_name_vault_name_unique";--> statement-breakpoint
ALTER TABLE "packages" DROP COLUMN IF EXISTS "vault_name";--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_name_unique" UNIQUE("name");
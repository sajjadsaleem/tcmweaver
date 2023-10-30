ALTER TABLE "packages" DROP CONSTRAINT "packages_name_unique";--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_stripe_prod_id_unique" UNIQUE("stripe_prod_id");
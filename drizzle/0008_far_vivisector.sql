ALTER TABLE "rolePermissions" RENAME TO "rolePermission";--> statement-breakpoint
ALTER TABLE "rolePermission" DROP CONSTRAINT "rolePermissions_role_id_permission_id_unique";--> statement-breakpoint
ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_role_id_permission_id_unique" UNIQUE("role_id","permission_id");
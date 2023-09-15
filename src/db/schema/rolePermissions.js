import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, unique } from 'drizzle-orm/pg-core';

export const rolePermissionsTable = pgTable('role_permissions', {
    id: serial('id').primaryKey(),
    role_id: integer('role_id'),
    permission_id: integer('permission_id'),
}, (role_permissions) => {
    return {
        uniqueRolePermission: unique().on(role_permissions.role_id, role_permissions.permission_id),
    }
});
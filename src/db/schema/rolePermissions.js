import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, unique } from 'drizzle-orm/pg-core';

export const rolePermission = pgTable('rolePermission', {
    id: serial('id').primaryKey(),
    role_id: integer('role_id'),
    permission_id: integer('permission_id'),
}, (rolePermission) => {
    return {
        uniqueRolePermission: unique().on(rolePermission.role_id, rolePermission.permission_id),
    }
});
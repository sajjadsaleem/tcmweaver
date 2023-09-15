import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const permissionsTable = pgTable('permissions', {
    id: serial('id').primaryKey(),
    label: varchar('label', { length: 256 }),
    name: varchar('name', { length: 256 }),
}, (permissions) => {
    return {
        nameIndex: uniqueIndex('name').on(permissions.name),
    }
});
import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
    id: serial('id').primaryKey(),
    label: text('label'),
    name: text('name'), // Change to text
}, (permissions) => {
    return {
        nameIndex: uniqueIndex('name').on(permissions.name),
    }
});


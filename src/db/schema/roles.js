import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    label: text('label'),
    name: text('name'),
}, (roles) => {
    return {
        nameIndex: uniqueIndex('name').on(roles.name),
    }
});
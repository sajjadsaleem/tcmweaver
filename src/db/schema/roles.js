import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
    id: serial('id').primaryKey(),
    label: varchar('label', { length: 256 }),
    name: varchar('name', { length: 256 }),
}, (roles) => {
    return {
        nameIndex: uniqueIndex('name').on(roles.name),
    }
});
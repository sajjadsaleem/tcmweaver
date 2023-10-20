
import { integer, pgEnum, pgTable, serial, uniqueIndex, varchar, text } from 'drizzle-orm/pg-core';

export const filtersTable = pgTable('filters', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (filters) => {
    return {
        filenameIndex: uniqueIndex('filename').on(filters.filename),
    }
});
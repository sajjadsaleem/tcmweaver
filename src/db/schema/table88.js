import { integer, pgEnum, pgTable, serial, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const table88Table = pgTable('table88', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (table88) => {
    return {
        filenameIndex: uniqueIndex('filename').on(table88.filename),
    }
});
import { integer, pgEnum, pgTable, serial, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const table40Table = pgTable('table40', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (table40) => {
    return {
        filenameIndex: uniqueIndex('filename').on(table40.filename),
    }
});
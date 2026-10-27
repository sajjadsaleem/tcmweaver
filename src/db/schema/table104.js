import { integer, pgEnum, pgTable, serial, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const table104Table = pgTable('table104', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (table104) => {
    return {
        filenameIndex: uniqueIndex('filename').on(table104.filename),
    }
});
import { integer, pgEnum, pgTable, serial, uniqueIndex, text } from 'drizzle-orm/pg-core';

export const table38Table = pgTable('table38', {
    id: serial('id').primaryKey(),
    filename: text('filename'), // Change to text
    content: text('content'), // Change to text
}, (table38) => {
    return {
        filenameIndex: uniqueIndex('filename').on(table38.filename),
    }
});
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";

export default async function getUsers(req, res) {
    if (req.method === 'POST') {
        try {
            const db = drizzle(sql)
            console.log('req', req.body.email)

            const userId = await db.select({ id: users.id }).from(users)
                .where(eq(users.email, req.body.email));

            res.status(200).json(userId);
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }
}
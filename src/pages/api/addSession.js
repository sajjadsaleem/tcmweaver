import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";

export default async function addSession(req, res) {
    if (req.method === 'POST') {
        try {
            const { session_id, user_email } = req.query

            const db = drizzle(sql)
            const updatedSessionId = await db.update(users)
                .set({ session_id: req.query.session_id })
                .where(eq(users.email, req.query.user_email));

            res.status(200).json({ message: 'Session added successfully' });
        } catch (error) {
            console.log('Error adding user:', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}
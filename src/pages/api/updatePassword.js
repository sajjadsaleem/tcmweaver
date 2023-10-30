// pages/api/updatePassword.js

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        // console.log(email, newPassword)

        const hashedPassword = await bcrypt.hash(password, 12);

        // console.log('hasedpass', hashedPassword)

        try {
            const db = drizzle(sql)
            const updatedUser = await db.update(users)
                .set({ password: hashedPassword })
                .where(eq(users.email, email));

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ message: 'Failed to update password' });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export default async function getUsers(req, res) {
    if (req.method === 'GET') {
        try {
            const db = drizzle(sql)
            const allUsers = await db.select().from(users);

            // console.log('usersssssssssssss', allUsers)

            res.status(200).json({ allUsers });
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }



}
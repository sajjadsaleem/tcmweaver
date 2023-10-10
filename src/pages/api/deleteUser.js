import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";


export default async function deleteUser(req, res) {
    if (req.method === 'DELETE') {
        const { email } = req.query;

        try {
            // const deletedUser = await prisma.users.delete({
            //     where: {
            //         email: email,
            //     },
            // });

            const db = drizzle(sql)
            const deletedUser = await db.delete(users).where(eq(users.email, email));

            const allUsers = await db.select().from(users);

            res.status(200).json({ message: 'User deleted successfully', allUsers });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Failed to delete user' });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

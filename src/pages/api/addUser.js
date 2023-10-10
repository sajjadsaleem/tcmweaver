import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export default async function addUser(req, res) {
    if (req.method === 'POST') {
        try {
            const { fullName, email, role, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 12);

            // Insert the user data into the database using Prisma
            // const newUser = await prisma.users.create({
            //     data: {
            //         role_id: role === 'admin' ? 1 : 2, // Assuming 1 is for admin and 2 is for user
            //         email,
            //         password: hashedPassword,
            //         verification_token: 'abcdefghijklmnopqrstuvwxyz1234567890',
            //         forgot_password_token: 'abcdefghijklmnopqrstuvwxyz1234567890',
            //         full_name: fullName,
            //         username: email,
            //         status: 'Active',
            //     },
            // });

            const db = drizzle(sql)
            let newUser = await db.insert(users).values({
                role_id: role === 'Admin' ? 1 : 2,
                email: email,
                password: hashedPassword,
                verification_token: '',
                forgot_password_token: '',
                full_name: fullName,
                username: email,
                status: 'Active',
            });

            const allUsers = await db.select().from(users);

            res.status(200).json({ message: 'User added successfully', allUsers: allUsers });
        } catch (error) {
            console.log('Error adding user:', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

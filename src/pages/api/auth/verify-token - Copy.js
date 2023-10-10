import * as jwt from '../../../util/jwt';
// import { PrismaClient } from '@prisma/client';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../../db/schema/users'
import { rolePermission } from '../../../db/schema/rolePermissions'
import { permissions } from '../../../db/schema/permissions'

import { eq, lt, gte, ne } from "drizzle-orm";

// const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return res.status(500).end();
        }

        const { token } = req.body;

        const tokenResult = jwt.verify(token);


        if (!tokenResult) {

            return res.status(401).json({ message: 'Token verification failed' });
        }
        // console.log('tokenResult:', tokenResult)

        // Prisma command
        // const user = await prisma.users.findUnique({
        //     where: {
        //         id: tokenResult.id,
        //     },
        // });

        const db = drizzle(sql)
        const userArray = await db.select().from(users).where(eq(users.id, tokenResult.id))
        const user = userArray[0] || null;
        console.log('verify token user', user)

        const result1 = await db.select().from(users).where(eq(users.id, tokenResult.id)).leftJoin(rolePermission, eq(rolePermission.role_id, user.role_id))
        // const result1 = await db.select().from(rolePermission).where(eq(rolePermission.role_id, user.role_id))

        console.log('result1', result1)


        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Perform other operations as needed

        return res.status(200).json({
            success: true,
            status: "success",
            tokenResult: tokenResult,
            token: token,
            // Include user data and other information in the response
        });
    } catch (error) {
        console.error('Error verify token:', error);

        return res.status(500).json({
            success: false,
            status: 'error',
            errors: [{ error: error }],
            message: 'Internal Server Error',
        });
    }
}

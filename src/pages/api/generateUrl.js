import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
import bcrypt from 'bcrypt';
import * as jwt from '../../util/jwt'
import nodemailer from 'nodemailer';


export default async function generateUrl(req, res) {
    if (req.method === 'POST') {
        try {

            const data = req.query.customer_email;
            console.log('============data', data)
            const db = drizzle(sql)
            const userExists = await db.select().from(users).where(eq(data, users.email));
            let userData = userExists[0]
            const redirectUrl = `${process.env.BASE_URL}/invitation/${userData.id}/${userData.verification_token}`;
            console.log(redirectUrl);
            let user = {id: userData.id, verification_token: userData.verification_token}
            
            return res.status(200).json({ message: 'Success', redirectUrl, user });
        } catch (error) {
            console.log('Error inviting user:', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end();
    }
}

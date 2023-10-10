import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
import bcrypt from 'bcrypt';
import * as jwt from '../../util/jwt'
import nodemailer from 'nodemailer';


export default async function addUser(req, res) {
    if (req.method === 'POST') {
        try {


            const data = req.body;
            // console.log('data', data)

            const userData = {
                role_id: data.role === 'Admin' ? 1 : 2,
                email: data.email,
                username: data.email,
                password: await bcrypt.hash('pending', 12),
                full_name: 'pending'
            };

            const db = drizzle(sql)
            let newUser = await db.insert(users).values({
                role_id: userData.role_id,
                email: userData.email,
                password: userData.password,
                verification_token: 'abcdefghijklmnopqrstuvwxyz1234567890',
                forgot_password_token: 'abcdefghijklmnopqrstuvwxyz1234567890',
                full_name: userData.full_name,
                username: userData.username,
                status: 'Inactive',
            });


            const newPendingUser = await db.select().from(users).where(eq(users.email, userData.email));
            console.log('newPendingUser', newPendingUser)

            const userId = newPendingUser[0].id
            const signedToken = jwt.sign({ id: userId }, { subject: 'user invitation email verification' })

            const updatedUser = await db.update(users)
                .set({ verification_token: signedToken })
                .where(eq(users.id, userId)).returning({ verification_token: users.verification_token });

            const verification_token = updatedUser[0].verification_token

            //////////////////////////////////////////////////
            // Create a transporter with your email service settings
            const transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
            });



            // Email sending function
            const emailSending = await transporter.sendMail({
                from: process.env.MAIL_FROM + ' <' + process.env.MAIL_SENDER_EMAIL + '>',
                to: userData.email,
                subject: 'Registration',
                html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Tcm Weaver Verification</title></head><body><style>body,html{padding:0;margin:0 auto}</style><div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;font-weight:400;font-size:15px;color:#020c30;min-height:100%;margin:0;padding:0;width:600px;background-color:#f6f6f9"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 auto;padding:0;max-width:600px"><tbody><tr><td align="center" valign="center" style="text-align:center;padding:40px"><h2 style="text-align:center">TCM WEAVER</h2></td></tr><tr><td align="left" valign="center"><div style="text-align:left;margin:0 20px;padding:40px;background-color:#fff;border-radius:6px"><div style="padding-bottom:30px;line-height:27px">Welcome! You are invited to access Tcm Weaver platform.<br><a href="' + process.env.BASE_URL + '/invitation/' + userId + '/' + verification_token + '" style="font-weight:600;color:#6923ff">Click here</a> to complete setting up your account and set password.</div><div style="padding-bottom:0;line-height:25px">Kind regards,<br>Tcm Weaver<tr><td align="center" valign="center" style="font-size:13px;text-align:center;padding:20px;color:#6d6e7c"></td></tr></div></div></td></tr></tbody></table></div></body></html>',
            });

            const allUsers = await db.select().from(users);

            res.status(200).json({
                success: true,
                status: "success",
                errors: [],
                message: 'The user is created and an invitation email is sent to the user. User will be able to login, as soon as the account is verified. Alternatively, you can set a password for them manually.',
                result: updatedUser,
                allUsers: allUsers

            });


            // res.status(200).json({ message: 'User invited successfully' });
        } catch (error) {
            console.log('Error inviting user:', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

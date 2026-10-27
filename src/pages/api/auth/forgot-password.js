import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import nodemailer from 'nodemailer';

import { rolesTable } from '../../../db/schema/roles'
import { rolePermissionsTable } from '../../../db/schema/rolePermissions'
import * as Helpers from '../../../util/Helpers'
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'

import { users } from '../../../db/schema/users';
// import fs from 'fs/promises'

export default async function handler(req, res) {

    try {
        const db = drizzle(sql)

        // const privateKey = await fs.readFile('./private.key', 'utf8'); // to sign JWT
        // const publicKey = await fs.readFile('./public.key', 'utf8'); // to verify JWT

        if (req.method !== 'POST') {
            return res.status(500).end();
        }

        const { email, password } = req.body;

        const rules = [{ email: ['required', 'email'] },]

        // console.log('rules=',rules)
        // Validate the request data
        const { errors, isValid } = Validation.validateSignupData(req.body, rules);

        if (!isValid || errors.length > 0) {
            return res.status(500).send({
                success: false,
                status: "error",
                errors: errors,
                message: 'Internal Server Error'
            });
        }

        // Check if the email already exists in the 'users' table
        const getUsers = await db.select().from(users).where(eq(users.email, email));
        // console.log('getusers', getUsers)

        if (getUsers.length === 0) {
            errors.push({ email: 'Email does not exist' })
            return res.status(500).send({
                success: false,
                status: "error",
                errors: errors,
                message: 'Email does not exist'
            });
        }

        const user = getUsers[0]
        const userId = user['id']

        const signedToken = jwt.sign({ id: userId }, { subject: 'Forgot Password' })

        const updatedUser = await db.update(users).set({ forgot_password_token: signedToken, })
            .where(eq(users.id, userId)).returning();

        const forgot_password_token = updatedUser[0]['forgot_password_token']
        // console.log('forgot_password_token', forgot_password_token)


        // Create a transporter with your email service settings
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });


        const emailSending = await transporter.sendMail({
            from: process.env.MAIL_FROM + ' <' + process.env.MAIL_SENDER_EMAIL + '>',
            to: email,
            subject: 'Forgot Password',
            html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>TCM Weaver Forgot Password</title></head><body><style>body,html{padding:0;margin:0 auto}</style><div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;font-weight:400;font-size:15px;color:#020c30;min-height:100%;margin:0;padding:0;width:600px;background-color:#f6f6f9"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 auto;padding:0;max-width:600px"><tbody><tr><td align="center" valign="center" style="text-align:center;padding:40px"><h2 style="text-align:center">TCM Weaver</h2></td></tr><tr><td align="left" valign="center"><div style="text-align:left;margin:0 20px;padding:40px;background-color:#fff;border-radius:6px"><div style="padding-bottom:30px;line-height:27px">We have received a reset password request for your account.<br><a href="' + process.env.BASE_URL + '/forgot-password/' + userId + '/' + forgot_password_token + '" style="font-weight:600;color:#6923ff">Click here</a> to reset your password.</div><div style="padding-bottom:0;line-height:25px">Kind regards,<br>TCM Weaver<tr><td align="center" valign="center" style="font-size:13px;text-align:center;padding:20px;color:#6d6e7c"></td></tr></div></div></td></tr></tbody></table></div></body></html>',
        });


        return res.status(200).send({
            success: true,
            status: "success",
            errors: [],
            message: 'Reset link sent. Please check your email',
            // result: result
        });

    } catch (error) {

        console.error('Error resetting password:', error);

        return res.status(500).send({
            success: false,
            status: "error",
            errors: [{ error: error }],
            message: 'Internal Server Error'
        });

    }
}

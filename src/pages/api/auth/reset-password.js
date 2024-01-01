import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import bcrypt from 'bcrypt';
import { eq, and } from "drizzle-orm";
import nodemailer from 'nodemailer';

import { users } from '../../../db/schema/users'
// import { rolesTable } from '../../../db/schema/roles'
// import { rolePermissionsTable } from '../../../db/schema/rolePermissions'
import * as Helpers from '../../../util/Helpers'
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'


export default async function handler(req, res) {

    try {
        const db = drizzle(sql)

        const { password, confirm_password, user_id, forgot_password_token } = req.body;
        console.log(password, confirm_password, user_id, forgot_password_token)

        const rules = [
            { password: ['required'] },
            { confirm_password: ['required', 'same:password'] },
        ]

        // Validate the request data
        const { errors, isValid } = Validation.validateSignupData(req.body, rules);

        if (req.method !== 'POST') {
            return res.status(500).send({
                success: false,
                status: "error",
                errors: errors,
                message: 'Internal Server Error (Invalid request method)'
            });
        }

        if (password != confirm_password) {
            errors.push({ confirm_password: 'password and confirm password must be same' })
        }

        if (!isValid || errors.length > 0) {
            return res.status(500).send({
                success: false,
                status: "error",
                errors: errors,
                message: 'Internal Server Error'
            });
        }

        // Check if the email already exists in the 'users' table
        const getUsers = await db.select().from(users).where(
            and(
                eq(users.id, user_id),
                eq(users.forgot_password_token, forgot_password_token)
            )
        );

        if (getUsers.length === 0) {
            errors.push({ email: 'User does not exist' })
            return res.status(500).send({
                success: false,
                status: "error",
                errors: errors,
                message: 'User does not exist'
            });
        }

        // Generate a salt (usually done by bcrypt internally)
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedUser = await db.update(users)
            .set({
                password: hashedPassword,
                status: 'Active',
            })
            .where(eq(users.id, user_id))
            .returning();

        return res.status(200).send({
            success: true,
            status: "success",
            errors: [],
            message: 'Password has been reset successfully',
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

import { db } from '@vercel/postgres';
import * as Validation from '../../../util/Validation'
import * as jwt from '../../../util/jwt'
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq, and } from "drizzle-orm";
import { users } from '../../../db/schema/users'
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';


// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };


export default async function signup(req, res) {
    if (req.method !== 'POST') {
        return res.status(500).end();
    } else {
        try {
            const { full_name, email, password, confirm_password, image } = req.body;

            const rules = [
                { full_name: ['required'] },
                { email: ['required', 'email'] },
                { password: ['required'] },
                { confirm_password: ['required'] },
            ]

            const { errors, isValid } = Validation.validateSignupData(req.body, rules);

            if (!isValid || errors.length > 0) {
                return res.status(500).send({
                    success: false,
                    status: "error",
                    errors: errors,
                    message: 'Internal Server Error'
                });
            }

            const db = drizzle(sql)

            const userEmailCheck = await db.select().from(users).where(eq(users.email, email));
            if (userEmailCheck.length > 0) {
                return res.status(500).send({
                    success: false,
                    status: "error",
                    error: errors,
                    message: 'This email is already registered'
                });
            }

            if (password != confirm_password) {
                errors.push({ confirm_password: 'password and confirm password must be the same' })
                return res.status(500).json({
                    success: false,
                    status: "error",
                    errors: errors,
                    message: 'password and confirm password must be the same'
                });
            }

            const saltRounds = 12;
            const salt = await bcrypt.genSalt(saltRounds);

            const hashedPassword = await bcrypt.hash(password, salt);

            let newUser = await db.insert(users).values({
                role_id: 2,
                email: email,
                password: hashedPassword,
                verification_token: '',
                forgot_password_token: '',
                full_name: full_name,
                username: email,
                image: image,
                status: 'Active',
            });

            return res.status(200).send({
                success: true,
                status: "success",
                message: 'Account created successfully',
                // token: signedToken,
                // user: {
                //     email: user.email
                // },
            });

        } catch (error) {
            console.error('Error creating user:', error);

            return res.status(500).send({
                success: false,
                status: "error",
                errors: [{ error: error }],
                message: 'Internal Server Error catch'
            });
        }
    }
}
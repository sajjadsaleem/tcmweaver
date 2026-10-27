import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
import bcrypt from 'bcrypt';
import * as Validation from '../../util/Validation'
import * as jwt from '../../util/jwt'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            let { password, confirm_password, userId, token } = req.body;
            userId = parseInt(userId);

            const tokenResult = jwt.verify(token)

            if (!tokenResult) {
                return res.status(500).json({
                    success: false,
                    status: "error",
                    errors: [],
                    message: "This invitation link has been expired.",
                    tokenResult: tokenResult,
                });
            }

            const rules = [
                { password: ['required'] },
                { confirm_password: ['required'] },
            ]

            const { errors, isValid } = Validation.validateSignupData(req.body, rules);

            if (password != confirm_password) {
                errors.push({ confirm_password: 'password and confirm password must be the same' })
                return res.status(500).json({
                    success: false,
                    status: "error",
                    errors: errors,
                    message: 'password and confirm password must be the same'
                });
            }

            const db = drizzle(sql)
            const tokenExist = await db.select({
                verification_token: users.verification_token
            }).from(users).where(eq(users.id, userId));

            if (tokenExist.length === 0 || !tokenExist[0].verification_token) {
                errors.push({ email: 'Token does not exist or expired' })
                return res.status(500).json({
                    success: false,
                    status: "error",
                    errors: errors,
                    message: 'Token does not exist or expired'
                });
            }

            if (!isValid || errors.length > 0) {
                return res.status(500).json({
                    success: false,
                    status: "error",
                    errors: errors,
                    message: 'Internal Server Error'
                });
            }

            const saltRounds = 12;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);


            const updatedUser = await db.update(users)
                .set({
                    password: hashedPassword,
                    forgot_password_token: tokenExist[0].verification_token,
                    verification_token: '',
                    status: 'Active',
                })
                .where(eq(users.id, userId)).returning();

            const payload = { id: updatedUser[0].id };
            const signingOptions = {
                subject: updatedUser[0].email
            };

            const signedToken = jwt.sign(payload, signingOptions);

            res.status(200).json({
                success: true,
                status: "success",
                errors: [],
                message: 'Password created successfully',
                token: signedToken,
                user: {
                email: updatedUser[0].email,
                role: updatedUser[0].role_id
                }
            });
        } catch (error) {
            console.log('Error adding user:', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

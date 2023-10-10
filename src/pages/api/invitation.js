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
            // console.log('req body', req.body)
            let { full_name, password, confirm_password, userId, token } = req.body;
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
                { full_name: ['required'] },
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

            // const tokenExist = await prisma.users.findMany({
            //     where: {
            //         id: userId,
            //         verification_token: token,
            //     },
            // });

            const db = drizzle(sql)
            const tokenExist = await db.select({
                verification_token: users.verification_token
            }).from(users).where(eq(users.id, userId));

            // console.log('tokenExist', tokenExist)

            if (tokenExist.length === 0) {
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
            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, salt);

            // console.log('hashed password', hashedPassword)

            // const updatedUser = await prisma.users.update({
            //     where: {
            //         id: userId,
            //     },
            //     data: {
            //         password: hashedPassword,
            //         forgot_password_token: tokenExist[0].verification_token,
            //         verification_token: '',
            //         full_name: full_name,
            //         status: 'Active',
            //     }
            // });

            const updatedUser = await db.update(users)
                .set({
                    password: hashedPassword,
                    forgot_password_token: tokenExist[0].verification_token,
                    verification_token: '',
                    full_name: full_name,
                    status: 'Active',
                })
                .where(eq(users.id, userId));

            res.status(200).json({
                success: true,
                status: "success",
                errors: [],
                message: 'Invitation accepted successfully',
            });
        } catch (error) {
            console.log('Error adding user:', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

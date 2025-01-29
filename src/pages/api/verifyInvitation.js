import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from "drizzle-orm";
import { users } from '../../db/schema/users'
import * as jwt from '../../util/jwt'
import * as Validation from '../../util/Validation'

export default async function verifyInvitation(req, res) {

    try {
        const db = drizzle(sql)
        if (req.method !== 'POST') {
            return res.status(500).end();
        }

        const rules = [
        ]
        const { token } = req.body;
        var tokenResult = jwt.verify(token)
        const { errors, isValid } = Validation.validateSignupData(req.body, rules);
        var user = []
        if (tokenResult) {
            const userId = tokenResult.id
            const tokenExist = await db.select({verification_token: users.verification_token}).from(users).where(eq(users.id, userId));
            if (tokenExist.length === 0 || !tokenExist[0].verification_token) {
                errors.push({ email: 'Password already created or token is expired.' })
                return res.status(500).json({
                    success: false,
                    status: "error",
                    errors: errors,
                    message: 'Password already created or token is expired.'
                });
            } else {
                return res.status(200).send({
                    success: true,
                    status: "success",
                });
            }
        }

        errors.push({ email: 'Password already created or token is expired.' })
        return res.status(500).json({
            success: false,
            status: "error",
            errors: errors,
            message: 'Password already created or token is expired.'
        });

    } catch (error) {
        console.error('Error verify token:', error);
        return res.status(500).send({
            success: false,
            status: "error",
            errors: [{ error: error }],
            message: 'Internal Server Error'
        });
    }
}
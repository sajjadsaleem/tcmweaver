import { PrismaClient } from '@prisma/client';
import * as jwt from '../../../util/jwt';

const prisma = new PrismaClient();

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
        console.log('tokenResult:', tokenResult)

        const user = await prisma.users.findUnique({
            where: {
                id: tokenResult.id,
            },
        });

        console.log('user', user)


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

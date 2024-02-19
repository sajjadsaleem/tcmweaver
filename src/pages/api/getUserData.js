import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";


const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function getUsers(req, res) {
    if (req.method === 'POST') {
        try {
            const db = drizzle(sql)
            console.log('req', req.body.email)

            const userId = await db.select().from(users)
                .where(eq(users.email, req.body.email));


            const customerSession = await stripe.customerSessions.create({
                customer: 'cus_PZCiL2Dnnp0BH3',
                components: {
                    pricing_table: {
                        enabled: true,
                    },
                },
            });

            console.log('customer session ', customerSession)


            res.status(200).json(userId);
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }
}
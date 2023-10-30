import { buffer } from 'micro';
import Stripe from 'stripe';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const webhookSigningKey = process.env.STRIPE_WEBHOOK_SIGNING_KEY;

export default async (req, res) => {
    if (req.method === 'POST') {
        const db = drizzle(sql)
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        let event;
        let user_id;
        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSigningKey);
            // console.log('event now', event)
            if (event.type === 'checkout.session.completed') {
                const user_id = await db.select({ user_id: users.id }).from(users)
                    .where(eq(users.session_id, event.data.object.id));

                // console.log('event type', event.data, 'user_id', user_id)

                // const updatedSessionId = await db.update(users)
                //     .set({ session_id: '' })
                //     .where(eq(users.session_id, 'cs_test_a1GH7ju1AEQJxo7j2iPWrzkKiDFrqQgnGLF5hcAj9qIn2oz1RSkFVmrVqH'));
            }
            if (event.type === 'customer.subscription.deleted') {
                console.log('event type', event.type)

            }
            if (event.type === 'invoice.paid') {
                // console.log('event type', event.type)
            }

            return res.status(200).json({ message: 'Webhook handled successfully.' });
        } catch (error) {
            res.status(400).send(error.message);
        }

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};

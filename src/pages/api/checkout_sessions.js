import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export default async function createCheckoutSession(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method not allowed'); // Method Not Allowed
    }

    try {
        const db = drizzle(sql)
        // const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all' });

        // console.log('trial days', req.query.trial_period_days)
        if (req.query.trial_period_days === 'null') {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                line_items: [
                    {
                        price: req.query.productId,
                        quantity: 1,
                    },
                ],
                success_url: `${req.headers.origin}/products/?session_id={CHECKOUT_SESSION_ID}&success=true`,
                cancel_url: `${req.headers.origin}/products/?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
            });



            // console.log('session', session.id)



            res.status(200).json({ sessionUrl: session.url, sessionId: session.id });
        } else {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                line_items: [
                    {
                        price: req.query.productId,
                        quantity: 1,
                    },
                ],
                subscription_data: {
                    trial_period_days: req.query.trial_period_days,
                },
                success_url: `${req.headers.origin}/products/?session_id={CHECKOUT_SESSION_ID}&success=true`,
                cancel_url: `${req.headers.origin}/products/?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
            });

            res.status(200).json({ sessionUrl: session.url, sessionId: session.id });

        }


    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
}
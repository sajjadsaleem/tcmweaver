import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export default async function createCheckoutSession(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method not allowed');
    }

    try {
        const db = drizzle(sql)

        const checkUser = await db.select({ user_name: users.full_name, customer_id: users.stripe_customer_id }).from(users).where(eq(users.email, req.query.email));

        if (checkUser[0].customer_id === null) {
            const NewCustomer = await stripe.customers.create({
                name: checkUser[0].user_name, email: req.query.email
            });

            const customerAdd = await db.update(users)
                .set({ stripe_customer_id: NewCustomer.id })
                .where(eq(users.email, req.query.email))
                .returning({ customer_id: users.stripe_customer_id });

            if (req.query.trial_period_days === 'null') {
                const session = await stripe.checkout.sessions.create({
                    mode: 'subscription',
                    line_items: [
                        {
                            price: req.query.productId,
                            quantity: 1,
                        },
                    ],
                    customer: NewCustomer.id,
                    success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
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
                    customer: NewCustomer.id,
                    success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
                    cancel_url: `${req.headers.origin}/products/?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
                });

                res.status(200).json({ sessionUrl: session.url, sessionId: session.id });
            }

        } else {
            if (req.query.trial_period_days === 'null') {
                const session = await stripe.checkout.sessions.create({
                    mode: 'subscription',
                    line_items: [
                        {
                            price: req.query.productId,
                            quantity: 1,
                        },
                    ],
                    customer: checkUser[0].customer_id,
                    success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
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
                    customer: checkUser[0].customer_id,
                    success_url: `${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
                    cancel_url: `${req.headers.origin}/products/?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
                });

                res.status(200).json({ sessionUrl: session.url, sessionId: session.id });

            }
        }
    } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
    }
}
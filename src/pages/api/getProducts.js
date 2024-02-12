import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { packagesTable } from '../../db/schema/packages';
import { userPackagesTable } from '../../db/schema/userPackages'
import { users } from '../../db/schema/users'
import { eq, lt, gte, ne } from "drizzle-orm";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


export const config = {
    maxDuration: 60,
};



export default async function getProducts(req, res) {
    if (req.method === 'POST') {
        try {
            const db = drizzle(sql)
            const stripeProducts = await stripe.products.list({ expand: ['data.default_price'], active: true });
            // console.log('stripe products', stripeProducts.data.length)

            if (req.body.user) {
                const customerId = await db.select({ customerId: users.stripe_customer_id }).from(users).where(eq(users.email, req.body.user))

                console.log('customerid', customerId)

                if (customerId[0].customerId) {
                    const customerSubscriptions = await stripe.subscriptions.list({
                        customer: customerId[0].customerId
                    });



                    console.log('customer subscriptions', customerSubscriptions)

                    const responseData = {
                        stripeProducts: stripeProducts.data,
                        customerSubscriptions: customerSubscriptions.data
                    };

                    res.status(200).json(responseData);

                } else {

                    const responseData = {
                        stripeProducts: stripeProducts.data,
                    };

                    res.status(200).json(responseData);
                }

            } else {
                const responseData = {
                    stripeProducts: stripeProducts.data
                }

                res.status(200).json(responseData)
            }


        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }

}
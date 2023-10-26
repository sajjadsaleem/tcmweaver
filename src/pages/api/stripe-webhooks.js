// // Backend API to handle Stripe webhook events
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handleWebhookEvent(req, res) {
//     const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//     if (req.method === 'POST') {
//         const payload = req.body;
//         const sig = req.headers['stripe-signature'];

//         let event;

//         try {
//             event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
//         } catch (err) {
//             console.error('Error verifying webhook signature:', err);
//             return res.status(400).send('Webhook signature verification failed');
//         }

//         if (event.type === 'checkout.session.completed') {
//             const session = event.data.object;

//             // You can now handle the payment status and other actions as needed
//             if (session.payment_status === 'paid') {
//                 // Payment was successful, and you can access session.metadata to get product details
//                 const productReference = session.metadata.product_reference;
//                 // Handle other actions, such as updating your database or notifying the user
//                 res.status(200).end();
//             } else {
//                 // Payment was not successful
//                 res.status(400).end();
//             }
//         }
//     } else {
//         res.status(405).end(); // Method Not Allowed
//     }
// }



import { buffer } from 'micro';
import Stripe from 'stripe';

// import { setActiveSubscription } from 'lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const webhookSigningKey = process.env.STRIPE_WEBHOOK_SIGNING_KEY;

export default async (req, res) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        let event;
        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSigningKey);
            // console.log('event now', event)
            if (event.type === 'checkout.session.completed') {
                console.log('event type', event.type)
            }
            if (event.type === 'customer.subscription.deleted') {
                console.log('event type', event.type)

            }
            if (event.type === 'invoice.paid') {
                console.log('event type', event.type)
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
        return res.status(200).json({ message: 'Webhook handled successfully.' });
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

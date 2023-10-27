import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
const webhookSigningKey = process.env.STRIPE_WEBHOOK_SIGNING_KEY;

export default async (req, res) => {
    console.log('req.method', req.method)
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

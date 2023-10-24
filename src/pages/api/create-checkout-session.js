// Backend API to create a payment session
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
export default async function createCheckoutSession(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    try {
        const session = await Stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.lineItems,
            success_url: req.body.successUrl,
            cancel_url: req.body.cancelUrl,
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Session creation failed' });
    }
}
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

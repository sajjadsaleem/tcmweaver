// import { sql } from '@vercel/postgres';
// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { users } from '../../db/schema/users'
// import { vaultsTable } from '../../db/schema/vaults'
// import { vaultPackagesTable } from '../../db/schema/vaultPackages';
// import { packagesTable } from '../../db/schema/packages';
// import { eq, lt, gte, ne } from "drizzle-orm";
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// export default async function confirmPayment(req, res) {
//     if (req.method === 'GET') {
//         const { sessionId } = req.query;
//         // console.log('sessionid', sessionId)

//         try {
//             // Retrieve the Checkout session from Stripe
//             const session = await stripe.checkout.sessions.retrieve(sessionId);
//             console.log('session to check payment', session.payment_status)

//             // Check the status of the session
//             // if (session.payment_status === 'paid') {
//             //     // Payment was successful
//             //     res.json({ paymentStatus: 'paid' });
//             // } else {
//             //     // Payment was not successful
//             //     res.json({ paymentStatus: 'failed' });
//             // }
//         } catch (error) {
//             console.error('Error verifying payment:', error);
//             res.status(500).json({ error: 'Payment verification failed' });
//         }
//     }
// }
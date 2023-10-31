import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { users } from '../../db/schema/users'
import { vaultsTable } from '../../db/schema/vaults'
// import { vaultPackagesTable } from '../../db/schema/vaultPackages';
import { packagesTable } from '../../db/schema/packages';
import { eq, lt, gte, ne } from "drizzle-orm";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



export default async function getProducts(req, res) {
    if (req.method === 'GET') {
        try {
            const db = drizzle(sql)
            const stripeProducts = await stripe.products.list({ expand: ['data.default_price'], active: true });

            // const allVaults = await db.select().from(vaultsTable)

            // console.log('allvaults', allVaults)
            // console.log('stripeProducts', stripeProducts)

            // const updatePackages = await db.update(packagesTable)
            //     .set({ password: hashedPassword })
            //     .where(eq(users.email, email));
            const responseData = {
                stripeProducts: stripeProducts.data,
                // allVaults: allVaults,
            };

            res.status(200).json(responseData);
        } catch (error) {
            console.error('Error reading files:', error);
            res.status(500).json({ error: 'Failed to read files.' });
        }
    }



}
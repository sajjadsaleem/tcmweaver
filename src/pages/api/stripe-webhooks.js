import { buffer } from 'micro';
import Stripe from 'stripe';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { packagesTable } from '../../db/schema/packages';
import { userPackagesTable } from '../../db/schema/userPackages';
import { eq, lt, gte, ne, and } from "drizzle-orm";

export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const webhookSigningKey = process.env.STRIPE_WEBHOOK_SIGNING_KEY;

export default async (req, res) => {
    console.log('=====================req', webhookSigningKey, req)
    if (req.method === 'POST') {
        const db = drizzle(sql)
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSigningKey);
            // console.log('event type ', event.type)

            if (event.type === 'checkout.session.completed') {
                // console.log('event', event.data.object.subscription)
                const productData = await new Promise((resolve, reject) => {
                    stripe.checkout.sessions.listLineItems(event.data.object.id, { limit: 5 }, function (err, lineItems) {
                        if (err) {
                            reject(err); // If there's an error, reject the promise
                        } else {
                            resolve(lineItems); // If successful, resolve the promise with lineItems
                        }
                    });
                });
                // console.log('productData', productData.data[0].price.product)
                const productName = await stripe.products.list({
                    ids: [productData.data[0].price.product],
                });
                // console.log('product name', productName.data[0].name)

                const packageId = await db.select({ packageId: packagesTable.id }).from(packagesTable)
                    .where(eq(packagesTable.name, productName.data[0].name))

                // console.log('packageId', packageId[0].packageId)




                const userId = await db.select({ user_id: users.id }).from(users)
                    .where(eq(users.session_id, event.data.object.id));

                // console.log('userid', userId)

                const removeSessionId = await db.update(users)
                    .set({ session_id: '' })
                    .where(eq(users.id, userId[0].user_id));

                // console.log('userid', userId, 'packageid', packageId)

                const checkUser = await db.select().from(userPackagesTable).where(
                    and(
                        eq(userPackagesTable.user_id, userId[0].user_id),
                        eq(userPackagesTable.package_id, packageId[0].packageId)
                    )
                );

                // console.log('checkuser', checkUser)

                if (checkUser.length > 0) {
                    // const updatePackage = await db.update(userPackagesTable)
                    //     .values({ user_id: userId, package_id: packageId })

                    console.log('sub id', event.data.object.subscription)

                    const udpatedPackage = await db.update(userPackagesTable)
                        .set({
                            user_id: userId[0].user_id, package_id: packageId[0].packageId, stripe_subscription_id: event.data.object.subscription
                        })
                        .where(
                            and(
                                eq(userPackagesTable.user_id, userId[0].user_id),
                                eq(userPackagesTable.package_id, packageId[0].packageId)
                            )
                        )
                        .returning();

                }
                else {
                    const updatePackage = await db.insert(userPackagesTable)
                        .values({ user_id: userId[0].user_id, package_id: packageId[0].packageId, stripe_subscription_id: event.data.object.subscription })
                }

                console.log('userid', userId, 'packageid', packageId)

            }

            if (event.type === 'customer.subscription.deleted') {
                console.log('sub id', event.data.object.id)
                const subscriptionDeletion = await db.delete(userPackagesTable)
                    .where(eq(userPackagesTable.stripe_subscription_id, event.data.object.id))
            }

            if (event.type === 'customer.subscription.updated') {
                console.log('event', event.data.object.plan.product)
                const packageId = await db.select({ packageId: packagesTable.id }).from(packagesTable)
                    .where(eq(packagesTable.stripe_prod_id, event.data.object.plan.product))

                console.log('packageid', packageId[0].packageId)

                const updatedUserPackage = await db.update(userPackagesTable)
                    .set({ package_id: packageId[0].packageId })
                    .where(eq(userPackagesTable.stripe_subscription_id, event.data.object.id))


            }

            if (event.type === 'product.updated') {
                // console.log('event type', event)
                const productId = event.data.object.id
                const productName = event.data.object.name
                // console.log('prod id', productId, event.data.object.name)
                const updatedPackage = await db.insert(packagesTable).values({ name: productName, stripe_prod_id: productId })
                    .onConflictDoUpdate({ target: packagesTable.stripe_prod_id, set: { name: productName } })

                // console.log('Package update result:', packageUpdate);
            }

            if (event.type === 'product.deleted') {
                // console.log('event type', event)
                const productId = event.data.object.id
                const updatedPackage = await db.delete(packagesTable)
                    .where(eq(packagesTable.stripe_prod_id, event.data.object.id))
            }


            return res.status(200).json({ message: 'Stripe Webhook handled successfully.' });
        } catch (error) {
            res.status(400).send(error.message);
        }

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
};



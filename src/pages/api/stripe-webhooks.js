import { buffer } from 'micro';
import Stripe from 'stripe';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users } from '../../db/schema/users'
import { packagesTable } from '../../db/schema/packages';
import { userPackagesTable } from '../../db/schema/userPackages';
import { eq, lt, gte, ne, and } from "drizzle-orm";

import bcrypt from 'bcrypt';
import * as jwt from '../../util/jwt'
import nodemailer from 'nodemailer';

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
    if (req.method === 'POST') {
        const db = drizzle(sql)
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSigningKey);

            if (event.type === 'checkout.session.completed') {
                console.log('event', event.data.object.subscription)
                const productData = await new Promise((resolve, reject) => {
                    stripe.checkout.sessions.listLineItems(event.data.object.id, { limit: 5 }, function (err, lineItems) {
                        if (err) {
                            reject(err); // If there's an error, reject the promise
                        } else {
                            resolve(lineItems); // If successful, resolve the promise with lineItems
                        }
                    });
                });

                console.log('productData', productData.data[0].price.product)
                const productName = await stripe.products.list({
                    ids: [productData.data[0].price.product],
                });


                console.log('product name', productName.data[0].name)

                const packageId = await db.select({ packageId: packagesTable.id }).from(packagesTable)
                    .where(eq(packagesTable.name, productName.data[0].name))

                // console.log('packageId', packageId[0].packageId)



                // const userId = await db.select({ user_id: users.id }).from(users)
                // .where(eq(users.session_id, event.data.object.id));
                // const userId = await db.select({ user_id: users.id }).from(users)
                //     .where(eq(users.email, event.data.object.client_reference_id));




                if (event.data.object.client_reference_id) {
                    let userId = null
                    userId = await db.select({ user_id: users.id }).from(users)
                        .where(eq(users.id, event.data.object.client_reference_id));

                        // const udpateStripeCustomerID = await db.insert(users)
                        // .values({ user_id: userId[0].user_id, package_id: packageId[0].packageId, stripe_subscription_id: event.data.object.subscription })

                    const userStripeCustomerId = await db.update(users).set({ stripe_customer_id: event.data.object.customer })
                        .where(eq(users.id, event.data.object.client_reference_id))
                        .returning();

                    


                    // console.log('userid', userId)

                    // const removeSessionId = await db.update(users)
                    //     .set({ session_id: '' })
                    //     .where(eq(users.id, userId[0].user_id));

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

                    // console.log('userid', userId, 'packageid', packageId)

                } else {

                    // console.log('======now in new user ')

                    const userExists = await db.select().from(users)
                        .where(eq(event.data.object.customer_details.email, users.email));

                    console.log('========userExists' , userExists )

                    if (userExists.length > 0) {
                        //==================User not loged in but already exists================

                        const userStripeCustomerId = await db.update(users).set({ stripe_customer_id: event.data.object.customer })
                        .where(eq(users.email, userExists[0].email)).returning();


                        // const udpatedPackage = await db.update(userPackagesTable)
                        //     .set({
                        //         package_id: packageId[0].packageId, stripe_subscription_id: event.data.object.subscription
                        //     })
                        //     .where(eq(userPackagesTable.user_id, userExists[0].id)).returning();

                            
                        const updatedPackage = await db.insert(userPackagesTable)
                                .values({ user_id })
                                .onConflictDoUpdate({
                                target: [userPackagesTable.user_id],
                                set: { package_id: packageId[0].packageId , stripe_subscription_id: event.data.object.subscription }
                                });

                    } else {

                        const userData = {
                            role_id: 2,
                            email: event.data.object.customer_details.email,
                            username: event.data.object.customer_details.email,
                            password: await bcrypt.hash('pending', 12),
                            full_name: 'pending',
                            stripe_customer_id: event.data.object.customer
                        };
        
                        let newUser = await db.insert(users).values({
                            role_id: userData.role_id,
                            email: userData.email,
                            password: userData.password,
                            verification_token: 'abcdefghijklmnopqrstuvwxyz1234567890',
                            forgot_password_token: 'abcdefghijklmnopqrstuvwxyz1234567890',
                            full_name: userData.full_name,
                            username: userData.username,
                            status: 'Inactive',
                            stripe_customer_id: userData.stripe_customer_id
                        }).returning();
    
                        // console.log('=======now at 3 newUser', newUser)
    
                        // const checkUser = await db.select().from(userPackagesTable).where(
                        //     and(
                        //         eq(userPackagesTable.user_id, newUser[0].id),
                        //         eq(userPackagesTable.package_id, packageId[0].packageId)
                        //     )
                        // );
    
                        // console.log('checkuser', checkUser)
    
                        // if (checkUser.length > 0) {
                            // const updatePackage = await db.update(userPackagesTable)
                            //     .values({ user_id: userId, package_id: packageId })
    
                            // console.log('sub id', event.data.object.subscription)
    
                            // const udpatedPackage = await db.update(userPackagesTable)
                            //     .set({
                            //         user_id: userId[0].user_id, package_id: packageId[0].packageId, stripe_subscription_id: event.data.object.subscription
                            //     })
                            //     .where(
                            //         and(
                            //             eq(userPackagesTable.user_id, newUser[0].id),
                            //             eq(userPackagesTable.package_id, packageId[0].packageId)
                            //         )
                            //     )
                            //     .returning();
    
                        // }
                        // else {
                        const updatePackage = await db.insert(userPackagesTable)
                            .values({ user_id: newUser[0].id, package_id: packageId[0].packageId, stripe_subscription_id: event.data.object.subscription })
                        // }
    
                        if (newUser) {
                            // console.log('=======now at 4 newUser')
                            const newPendingUser = newUser
    
                            const userId = newPendingUser[0].id
                            const signedToken = jwt.sign({ id: userId }, { subject: 'user invitation email verification' })
                            // console.log('======== now at 5signed token  ', signedToken)
    
                            const updatedUser = await db.update(users)
                                .set({ verification_token: signedToken })
                                .where(eq(users.id, userId)).returning({ verification_token: users.verification_token });
    
                            const verification_token = updatedUser[0].verification_token
    
                            // console.log('=========now at 6verification_token', verification_token)
    
    
                            //////////////////////////////////////////////////
                            // Create a transporter with your email service settings
                            const transporter = nodemailer.createTransport({
                                host: process.env.MAIL_HOST,
                                port: process.env.MAIL_PORT,
                                secure: true,
                                auth: {
                                    user: process.env.MAIL_USERNAME,
                                    pass: process.env.MAIL_PASSWORD,
                                },
                            });
    
    
                            // Email sending function
                            const emailSending = await transporter.sendMail({
                                from: process.env.MAIL_FROM + ' <' + process.env.MAIL_SENDER_EMAIL + '>',
                                to: userData.email,
                                subject: 'Registration',
                                html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Tcm Weaver Registration</title></head><body><style>body,html{padding:0;margin:0 auto}</style><div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;font-weight:400;font-size:15px;color:#020c30;min-height:100%;margin:0;padding:0;width:600px;background-color:#f6f6f9"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 auto;padding:0;max-width:600px"><tbody><tr><td align="center" valign="center" style="text-align:center;padding:40px"><h2 style="text-align:center">TCM WEAVER</h2></td></tr><tr><td align="left" valign="center"><div style="text-align:left;margin:0 20px;padding:40px;background-color:#fff;border-radius:6px"><div style="padding-bottom:30px;line-height:27px">Welcome! Thankyou for subscribing to Tcm Weaver . You are invited to access Tcm Weaver platform.<br><a href="' + process.env.BASE_URL + '/invitation/' + userId + '/' + verification_token + '" style="font-weight:600;color:#6923ff">Click here</a> to complete setting up your account and set password.</div><div style="padding-bottom:0;line-height:25px">Kind regards,<br>Tcm Weaver<tr><td align="center" valign="center" style="font-size:13px;text-align:center;padding:20px;color:#6d6e7c"></td></tr></div></div></td></tr></tbody></table></div></body></html>',
                            });
                        }
    

                    }


                    
                }

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
            console.log('error in stripe webhook api', error)
            res.status(400).send(error.message);
        }

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('');
    }
};



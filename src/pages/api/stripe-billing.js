import { config } from 'process';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,);




export default async function stripeBilling(req, res) {
    if (req.method === 'POST') {
        try {
            // console.log('req', req.query.customer_id)

            const allProducts = await stripe.products.list({ active: true });
            // console.log('======================1',allProducts)

            const allPrices = await stripe.prices.list({ active: true });
            // console.log('======================2' , allPrices)

            const formattedProducts = allProducts.data.map(product => {
                // Filter prices based on the product id
                const prices = allPrices.data
                    .filter(price => price.product === product.id)
                    .map(price => price.id);
            
                // Return formatted product object
                return {
                    product: product.id,
                    prices: prices
                };
            });
            // console.log('====================formattedProducts' , formattedProducts)

            const configuration = await stripe.billingPortal.configurations.create({
                features: {
                    payment_method_update: { enabled: true },
                    subscription_cancel: {
                        enabled: true,
                        // mode: 'immediately',
                        // proration_behavior: 'none'
                    },
                    subscription_update: {
                        enabled: true,
                        default_allowed_updates: ['price'],
                        products: formattedProducts,
                        // proration_behavior: "none"
                    },
                    invoice_history: {
                        enabled: true
                    },
                },
                business_profile: {
                    privacy_policy_url: 'https://example.com/privacy',
                    terms_of_service_url: 'https://example.com/terms',
                },
            });

            const session = await stripe.billingPortal.sessions.create({

                customer: req.query.customer_id,
                configuration: configuration.id,
                return_url: 'https://www.tcmweaver.com/',
            });

            return res.status(200).json(session);
        } catch (error) {
            console.log('Error :', error);
            res.status(500).json({ message: error });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}
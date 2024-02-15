import { SubscriptTwoTone } from '@mui/icons-material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);



const ConfirmationPage = () => {
    const [sessionData, setSessionData] = useState<any>({})
    const [sessionCustomer, setSessionCustomer] = useState<any>({})
    const [sessionSubscription, setSessionSubscription] = useState<any>({})
    const [sessionProduct, setSessionProduct] = useState<any>({})
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    async function getSessionData(sessionId: any) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId)
            const customer = await stripe.customers.retrieve(session.customer);
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            const subscriptionItem = subscription.items.data[0]
            const productId = subscriptionItem.plan.product;
            const product = await stripe.products.retrieve(productId);


            console.log('Session data:', session)
            console.log('Session customer data:', customer)
            console.log('Session subscription data:', subscription)
            console.log('Product Name:', product);


            setSessionData(session)
            setSessionCustomer(customer)
            setSessionSubscription(subscription)
            setSessionProduct(product)
            setLoading(false)

        } catch (error) {
            console.error('Error retrieving session data:', error)
            throw error
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        console.log('=======query', query)




        if (query) {
            const sessionId = query.get('checkout_session');
            // const sessionId = 'cs_test_a11CXwYMof4Spq8xgooIItefxUoZsxy5V7jXm5eA3QM9re1vAv5yrOP66N';

            if (sessionId) {
                getSessionData(sessionId);
            }

            // if (query.get('success')) {
            //     toast("Payment successful", {
            //         position: "top-right",
            //         autoClose: 1500,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         type: "success",
            //         theme: "light",
            //     });
            // }

            // if (query.get('canceled')) {
            //     toast("Payment failed", {
            //         position: "top-right",
            //         autoClose: 1500,
            //         hideProgressBar: false,
            //         closeOnClick: true,
            //         pauseOnHover: true,
            //         draggable: true,
            //         progress: undefined,
            //         type: "error",
            //         theme: "light",
            //     });
            // }

            // router.replace({
            //     pathname: router.pathname,
            //     query: {},
            // }, undefined, { shallow: true });
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }




    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh', color: '#6C655C' }}>

            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                    <h5>TCM Weaver</h5>
                    <p style={{ marginTop: '25px' }}>{`Subscribe to ${sessionProduct.name.toUpperCase()}`}</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '38px', color: 'black' }}>
                            {`$${(sessionSubscription.plan.amount / 100).toFixed(2)}`}
                        </span>
                        <span style={{ fontSize: '14px', width: '50px', lineHeight: '1.1' }}>
                            {sessionSubscription.plan.interval === 'month' ? 'Per Month' : 'Yearly'}


                        </span>

                    </p>


                </div>

            </div>


            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)' }}>


                <div style={{ textAlign: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid green', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ fontSize: '24px', color: 'green' }}>&#10004;</div>
                    </div>
                    <h3 style={{ color: 'black' }}>Thanks for subscribing</h3>
                    <p>A payment to TCM WEAVER will appear on your statement.</p>

                    <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                        outline: 'none',
                        textDecoration: 'none',
                        display: 'inline-block',
                        textAlign: 'center',
                        lineHeight: 'normal',
                        marginTop: '20px'
                    }}
                        onMouseEnter={(e: any) => e.target.style.backgroundColor = '#45a049'}
                        onMouseLeave={(e: any) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        OK
                    </button>


                </div>
            </div>


        </div>
    )
}

export default ConfirmationPage
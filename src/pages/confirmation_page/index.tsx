import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const ConfirmationPage = () => {

    const router = useRouter();



    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        console.log('=======query', query)

        async function getSessionData(sessionId: any) {
            try {

                console.log('other keys key ', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
                console.log('secret key ', process.env.STRIPE_SECRET_KEY)
                console.log('sessionId ', sessionId)
                const session = await stripe.checkout.sessions.retrieve(sessionId);
                console.log('Session data:', session);
                return session;
            } catch (error) {
                console.error('Error retrieving session data:', error);
                throw error;
            }
        }


        if (query) {
            const sessionId = query.get('checkout_session');


            getSessionData(sessionId);




            if (query.get('success')) {
                toast("Payment successful", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: "success",
                    theme: "light",
                });
            }

            if (query.get('canceled')) {
                toast("Payment failed", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    type: "error",
                    theme: "light",
                });
            }

            // router.replace({
            //     pathname: router.pathname,
            //     query: {},
            // }, undefined, { shallow: true });
        }
    }, []);

    return (

        <div>index</div>
    )
}

export default ConfirmationPage
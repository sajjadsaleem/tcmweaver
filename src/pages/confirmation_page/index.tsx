import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const ConfirmationPage = () => {

    const router = useRouter();

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        console.log('=======query', query)

        async function getSessionData(sessionId: any) {
            try {
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
            console.log('sessionId ', sessionId)

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
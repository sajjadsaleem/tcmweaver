import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { toast } from 'react-toastify';

const ConfirmationPage = () => {

    const router = useRouter();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query) {
            const sessionId = query.get('session_id');
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

            router.replace({
                pathname: router.pathname,
                query: {},
            }, undefined, { shallow: true });
        }
    }, []);

    return (

        <div>index</div>
    )
}

export default ConfirmationPage
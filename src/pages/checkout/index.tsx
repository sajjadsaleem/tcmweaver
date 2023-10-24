import React from 'react'
import {loadStripe} from '@stripe/stripe-js'

type LineItem = {
    // Define the structure of a line item
    price: string;
    quantity: number;
    // Add other properties as needed
  };

const checkout = async ({ lineItems }: { lineItems: LineItem[] }) => {

    let stripePromise:any = null
    let getStripe = async () => {
        if(!stripePromise){
            if (process.env.NEXT_PUBLIC_API_KEY) {
                stripePromise = loadStripe(process.env.NEXT_PUBLIC_API_KEY);
                return stripePromise
            }
        }
    }

    const stripe = await getStripe()
    await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems,
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: window.location.origin
    })
            
        
    

  return (
    <div>index</div>
  )
}

export default checkout
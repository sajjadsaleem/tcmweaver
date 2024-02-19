import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import Script from 'next/script';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': any; // or specify the correct type if available
    }
  }
}


// const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);


const Products = () => {
  const [userData, setUserData] = useState<any>({})
  const [userEmail, setUserEmail] = useState()
  const [customerSession, setCustomerSession] = useState("")
  const [loginState, setLoginState] = useState(false)

  // console.log('login state ', loginState)


  // get all products from stripe on startup
  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // ===============If User is Logged in=======================

      setLoginState(true)

      const userDataCheck = JSON.parse(storedUser);
      const email: any = userDataCheck.email
      setUserEmail(email)
      axios.post('/api/getUserData', { email })
        .then(async (res: any) => {
          // console.log('res', res.data[0].id, typeof res.data[0].id.toString())
          console.log('res', res.data)
          let id = res.data[0].id.toString()
          setUserData(id);
          if (res.data[0].stripe_customer_id) {
            console.log(' now here ===================', res.data[0].stripe_customer_id)
            const userCustomerId = res.data[0].stripe_customer_id
            // const customerSession = await stripe.customerSessions.create({
            //   customer: 'cus_PZCiL2Dnnp0BH3',
            //   components: {
            //     pricing_table: {
            //       enabled: true,
            //     },
            //   },
            // });

            // console.log('customer session', customerSession)
            // setCustomerSession(customerSession.client_secret)

          } else {

            setCustomerSession("")
          }

        })
        .catch((err) => {
          console.log('error getting user id', err)
        })



    } else {
      // ===============If User is Not Logged in=======================

      setLoginState(false)
      console.log('no user logged in')

    }


  }, [])





  return (
    <div>
      {loginState ? (
        <stripe-pricing-table pricing-table-id="prctbl_1OiyHtDIjS01COwV22YFSBMv"
          publishable-key="pk_test_51OeKtoDIjS01COwVIBkwJJj29R1ckF4WQndtkc6q3lbdZAiLcGjGq8CSBmyfzPtEtC04lI2KGCVP4g9VDRCC1hiD00RmM8wzf6" client-reference-id={userData} customer-email={userEmail}>
        </stripe-pricing-table>
      ) : (
        <stripe-pricing-table pricing-table-id="prctbl_1OiyHtDIjS01COwV22YFSBMv"
          publishable-key="pk_test_51OeKtoDIjS01COwVIBkwJJj29R1ckF4WQndtkc6q3lbdZAiLcGjGq8CSBmyfzPtEtC04lI2KGCVP4g9VDRCC1hiD00RmM8wzf6" >
        </stripe-pricing-table>
      )}





      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
    </div>
  );
};

export default Products;

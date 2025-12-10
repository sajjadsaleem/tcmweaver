import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import Script from 'next/script';


// const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);


const Products = () => {

  const router = useRouter()

  const [userData, setUserData] = useState<any>({})
  const [userEmail, setUserEmail] = useState()
  const [customerSession, setCustomerSession] = useState("")
  const [loginState, setLoginState] = useState(false)
  const [loading, setLoading] = useState(true);
  

  // console.log('login state ', loginState)


  // get all products from stripe on startup
  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // ===============If User is Logged in=======================

      setLoginState(true)


      const userDataCheck = JSON.parse(storedUser);
      const email: any = userDataCheck.email

      axios.post('/api/getUserData', { email })
        .then(async (res: any) => {
          console.log('res', res.data)

          if (res.data[0].stripe_customer_id) {
            // ==============If logged in user already has a stripe subscription=================
            try {
              const billingResponse = await axios.post(`/api/stripe-billing?customer_id=${res.data[0].stripe_customer_id}`);
              window.location.href = billingResponse.data.url;
            } catch (err) {
              console.log('err from stripe billing', err);
              console.log('err from stripe billing', err);
              let id = res.data[0].id.toString()
              setUserData(id);
              let email = res.data[0].email
              setUserEmail(email)
            }
              
          } else {

            // ==============If logged in user does not have a stripe subscription=================


            let id = res.data[0].id.toString()
            setUserData(id);
            let email = res.data[0].email
            setUserEmail(email)

          }
        })
        .catch((err) => {
          console.log('error getting user id', err)
        })
        .finally(() => setLoading(false));

    } else {
      // ===============If User is Not Logged in=======================

      setLoginState(false)
      setLoading(false);

    }


  }, [])





  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      ) : (
        loginState ? (
          //==============Stripe Test keys and table==================
          // <stripe-pricing-table pricing-table-id="prctbl_1OiyHtDIjS01COwV22YFSBMv"
          //   publishable-key="pk_test_51OeKtoDIjS01COwVIBkwJJj29R1ckF4WQndtkc6q3lbdZAiLcGjGq8CSBmyfzPtEtC04lI2KGCVP4g9VDRCC1hiD00RmM8wzf6" client-reference-id={userData} customer-email={userEmail}>
          // </stripe-pricing-table>

          // <stripe-pricing-table pricing-table-id="prctbl_1QkpZsCpbULNwyCer0lDEhDb"
          // publishable-key="pk_test_51Q3hSrCpbULNwyCeBaXT2jBFdrfHQ8UNxqWbpkRaiWSaHGC26BHsVPHsVTXAsH2qnMoAQUCPp7p0t0taKP9pzdl500NdkvXpHE" client-reference-id={userData} customer-email={userEmail}>
          // </stripe-pricing-table>

          <stripe-pricing-table pricing-table-id="prctbl_1OeT0HDIjS01COwV1crw380f"
            publishable-key="pk_live_51OeKtoDIjS01COwV377lJJe6q9TrLUiIMgqM2fhcHOSuw6KyGuBfR2iJkoTk4tcqxZ41rPVhHYcIF9n2BJbIhTFI00n3CgQ4wp" client-reference-id={userData} customer-email={userEmail}>
          </stripe-pricing-table>
        ) : (
          // ==============Stripe Test keys and table==================
          // <stripe-pricing-table pricing-table-id="prctbl_1OiyHtDIjS01COwV22YFSBMv"
          //   publishable-key="pk_test_51OeKtoDIjS01COwVIBkwJJj29R1ckF4WQndtkc6q3lbdZAiLcGjGq8CSBmyfzPtEtC04lI2KGCVP4g9VDRCC1hiD00RmM8wzf6" >
          // </stripe-pricing-table>

          // <stripe-pricing-table pricing-table-id="prctbl_1QkpZsCpbULNwyCer0lDEhDb"
          //   publishable-key="pk_test_51Q3hSrCpbULNwyCeBaXT2jBFdrfHQ8UNxqWbpkRaiWSaHGC26BHsVPHsVTXAsH2qnMoAQUCPp7p0t0taKP9pzdl500NdkvXpHE">
          // </stripe-pricing-table>

          <stripe-pricing-table pricing-table-id="prctbl_1OeT0HDIjS01COwV1crw380f"
            publishable-key="pk_live_51OeKtoDIjS01COwV377lJJe6q9TrLUiIMgqM2fhcHOSuw6KyGuBfR2iJkoTk4tcqxZ41rPVhHYcIF9n2BJbIhTFI00n3CgQ4wp">
          </stripe-pricing-table>
        )
      )}

      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
    </div>
  );
};

export default Products;

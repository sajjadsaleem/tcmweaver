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



const Products = () => {
  const [userData, setUserData] = useState<any>({})
  const [userEmail, setUserEmail] = useState()
  const [customerSession, setCustomerSession] = useState("")

  // const [productsData, setProductsData] = useState<any>([])
  // const [customerSubscriptions, setCustomerSubscriptions] = useState<any>([])

  // console.log('useremail', typeof userEmail, userEmail)
  // console.log('userid', typeof userData, userData)


  // console.log('productsData', productsData, 'customerSubscriptions', customerSubscriptions)

  // const router = useRouter();

  // get all products from stripe on startup
  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // ===============If User is Logged in=======================

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
            console.log(' now there ===================')

            setCustomerSession("")
          }

        })
        .catch((err) => {
          console.log('error getting user id', err)
        })



    } else {
      // ===============If User is Not Logged in=======================
      console.log('no user logged in')

    }

    //   // console.log('user', user)

    //   axios.post(`/api/getProducts`, user)
    //     .then((res: any) => {
    //       if (res.data.customerSubscriptions) {
    //         // console.log('res', res)
    //         const products = res.data.customerSubscriptions.map((subscription: any) => subscription.plan.product);
    //         setCustomerSubscriptions(products)
    //         setProductsData(res.data.stripeProducts)
    //       } else {
    //         setProductsData(res.data.stripeProducts)
    //       }

    //     })
    //     .catch((err: any) => {
    //       console.log('error getting products', err)
    //     })

  }, [])


  // const getStripe = (product: any) => {

  //   if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  //     const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  //   }


  //   const storedData: any = localStorage.getItem("user");
  //   // console.log('storedData' , storedData)
  //   const userObject: any = JSON.parse(storedData)
  //   // console.log('userobject' , userObject)

  //   if (userObject === null) {
  //     router.push('/login');
  //   } else {
  //     axios.post(`/api/checkout_sessions?productId=${product.default_price.id}&trial_period_days=${product.default_price.recurring.trial_period_days}&email=${userObject.email}`)
  //       .then((res: any) => {
  //         axios.post(`/api/addSession?session_id=${res.data.sessionId}&user_email=${userObject.email}`)
  //           .then((res: any) => {
  //             console.log('sessionId saved')
  //           })
  //           .catch((err: any) => {
  //             console.log('error saving sessionId', err)
  //           })

  //         // console.log('res' , res.data.sessionId)
  //         window.location.href = res.data.sessionUrl;

  //       })
  //       .catch((err: any) => {
  //         console.log('err', err)
  //       })

  //   }
  // }


  return (
    // <div>
    //   <div className='product-page-body'>
    //     <img src='graph-logoold.png' alt='logo' style={{ width: '70px' }} />
    //     <h3 style={{ marginLeft: '12px', color: '#616161', marginBottom: '0px' }}>TCM Weaver</h3>
    //   </div>

    //   <div className='products-container'>

    //     {productsData.map((product: any, index: any) => (
    //       <div className='product-div' key={index}>

    //         <div style={{ marginBottom: '22px', minHeight: '75px' }}>
    //           <span className='product-name'>
    //             {customerSubscriptions && customerSubscriptions.includes(product.id) ? (
    //               <div style={{ position: "relative" }}>
    //                 {product.name}
    //                 <span style={{ backgroundColor: '#E1E1E1', padding: '3px 10px', borderRadius: '6px', fontSize: '14px', float: 'right' }}>
    //                   current
    //                 </span>
    //               </div>
    //             ) : (
    //               <>
    //                 {product.name}
    //               </>
    //             )}
    //           </span>
    //           <span className='product-description'>
    //             {product.description}
    //           </span>
    //         </div>

    //         <div style={{ display: 'flex', flexDirection: 'column' }}>
    //           <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
    //             <span style={{ fontWeight: '700', fontSize: '32px' }}>
    //               {product.default_price && product.default_price.unit_amount && (
    //                 `$${product.default_price.unit_amount / 100}`
    //               )}
    //             </span>

    //             <span style={{ color: 'grey', fontSize: '14px', width: '50px', lineHeight: '1' }}>
    //               {product.default_price && product.default_price.recurring && product.default_price.recurring.interval === 'month' ? 'per month'
    //                 : product.default_price && product.default_price.recurring && product.default_price.recurring.interval === 'year' ? 'per year'
    //                   : product.default_price && product.default_price.recurring === null ? product.default_price.type === 'one_time' ? 'one time' : '' : ''
    //               }
    //             </span>
    //           </p>

    //           {customerSubscriptions.includes(product.id) ? (
    //             <button className='product-button' style={{ cursor: 'no-drop', backgroundColor: '#1565c0', opacity: '0.6' }}
    //             //  onClick={() => getStripe(product)}
    //             >
    //               {product.default_price.recurring && product.default_price.recurring.trial_period_days === null
    //                 ? 'Subscribe'
    //                 : `Start Trial`
    //               }
    //             </button>
    //           ) : (
    //             <>
    //               <button className='product-button' onClick={() => getStripe(product)}>
    //                 {product.default_price && product.default_price.recurring && product.default_price.recurring.trial_period_days === null
    //                   ? 'Subscribe'
    //                   : `Start Trial`
    //                 }
    //               </button>
    //             </>

    //           )
    //           }

    //         </div>

    //         {product.features.length > 0 && (
    //           <div>
    //             <span className='product-features-heading'>
    //               This includes:
    //             </span>
    //             {product.features.map((feature: any, index: any) => (
    //               <div key={index} className='product-features-div'>
    //                 <div>
    //                   <img src='tick-icon.jpg' alt='icon' width='13px' />
    //                 </div>
    //                 <span>{feature.name}</span>

    //               </div>

    //             ))}
    //           </div>

    //         )}

    //       </div>
    //     ))}

    //   </div>

    // </div>
    <div>

      {/* <stripe-pricing-table pricing-table-id="prctbl_1OeT0HDIjS01COwV1crw380f"
        publishable-key="pk_live_51OeKtoDIjS01COwV377lJJe6q9TrLUiIMgqM2fhcHOSuw6KyGuBfR2iJkoTk4tcqxZ41rPVhHYcIF9n2BJbIhTFI00n3CgQ4wp">
      </stripe-pricing-table> */}
      <stripe-pricing-table pricing-table-id="prctbl_1OiyHtDIjS01COwV22YFSBMv"
        publishable-key="pk_test_51OeKtoDIjS01COwVIBkwJJj29R1ckF4WQndtkc6q3lbdZAiLcGjGq8CSBmyfzPtEtC04lI2KGCVP4g9VDRCC1hiD00RmM8wzf6" client-reference-id={userData} customer-email={userEmail}>
      </stripe-pricing-table>


      <Script async src="https://js.stripe.com/v3/pricing-table.js" />
    </div>
  );
};

export default Products;

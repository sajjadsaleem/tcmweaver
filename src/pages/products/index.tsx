import axios  from 'axios';
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}



const Products = () => {
  const [productsData , setProductsData] = useState<any>([])

  // console.log('getProducts response' , productsData)

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if(query){
      const sessionId = query.get('session_id');
      // console.log('sessionid' , sessionId)

    
      // console.log('query' , query)
      if (query.get('success')) {
        console.log('Order placed! You will receive an email confirmation.');
      }

      if (query.get('canceled')) {
        console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
      }
    }
  }, []);

  useEffect(()=> {
    axios.get(`/api/getProducts`)
        .then((res:any)=> {
          // console.log('res' , res)
          setProductsData(res.data.stripeProducts)
          console.log('getProducts response' , res.data)
        })
        .catch((err:any)=> {
          console.log('error getting products' , err)
        })

  } , [])

  const getStripe = (product:any)=> {
    if(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY){
      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    // console.log('product' , product)
    
      const storedData:any = localStorage.getItem("user");
      const userObject:any = JSON.parse(storedData)

    axios.post(`/api/checkout_sessions?productId=${product.default_price.id}&trial_period_days=${product.default_price.recurring.trial_period_days}`)
    .then((res:any)=>{
     

      axios.post(`/api/addSession?session_id=${res.data.sessionId}&user_email=${userObject.email}`)
      .then((res:any)=>{
        console.log('sessionId saved')
      })
      .catch((err:any)=>{
        console.log('error saving sessionId')
      })
      
      // console.log('res' , res.data.sessionId)
      window.location.href = res.data.sessionUrl;

    })
    .catch((err:any)=>{
      console.log('err' , err)
    })

    
  }
  

  return (
    <div>
      <div className='product-page-body'>
        <img src='graph-logo.png' alt='logo' style={{ width: '50px' }} />
        <h3 style={{ marginLeft: '12px', color: '#616161' }}>TCM Weaver</h3>
      </div>

      <div className='products-container'>
        {productsData.map((product:any , index:any) => (
          <div className='product-div' key={index}>
            <div style={{marginBottom: '22px' , minHeight:'75px' }}>
              <span className='product-name'>
                {product.name}
              </span>
              <span className='product-description'>
                {product.description}
              </span>
            </div>

            <div style={{display: 'flex' , flexDirection: 'column' }}>
                <p style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <span style={{fontWeight: '700' , fontSize:'32px'}}>
                    ${(product.default_price.unit_amount)/100}
                  </span>
                  <span style={{ color: 'grey', fontSize: '14px', width:'50px' , lineHeight:'1'}}>
                    {product.default_price.recurring.interval === 'month'
                      ? 'per month'
                      : product.default_price.recurring.interval === 'year'
                      ? 'per year'
                      : product.default_price.recurring.interval // Fallback to the original value
                    }
                  </span>
                </p>
                  
                <button className='product-button' onClick={() => getStripe(product)}>
                  {product.default_price.recurring.trial_period_days === null
                    ? 'Subscribe'
                    : `Start Trial`
                  }
                </button>
            </div>

            {product.features.length > 0 && (
            <div>
              <span className='product-features-heading'>
                This includes:
              </span>
              {product.features.map((feature:any, index:any)=>(
                <div key={index} className='product-features-div'>
                  <div>
                    <img src='tick-icon.jpg' alt='icon' width='13px'/>
                  </div>
                  <span>{feature.name}</span>
                  
                </div>
                
              ))}
            </div>

            )}
          </div>
        ))
        }

      </div>

    </div>
  );
};

export default Products;

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import axios from "axios";
import Link from 'next/link';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import * as Helpers from '../../util/Helpers'

const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);



const ConfirmationPage = () => {
    const [sessionData, setSessionData] = useState<any>({})
    const [sessionCustomer, setSessionCustomer] = useState<any>({})
    const [sessionSubscription, setSessionSubscription] = useState<any>({})
    const [sessionProduct, setSessionProduct] = useState<any>({})
    const [loading, setLoading] = useState(true);
    const [showRedirection , setShowRedirection] = useState(false)
    const [validationErrors, setValidationErrors] = useState<any>({
        password: '',
        confirmPassword: '',
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [btnLoading, setBtnLoading] = useState(false)
    const [user_id, setUserId] = useState(null)
    const [verification_token, setVerificationToken] = useState(null)
    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false)

    const router = useRouter();

    async function getSessionData(sessionId: any) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId)
            const customer = await stripe.customers.retrieve(session.customer);
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            const subscriptionItem = subscription.items.data[0]
            const productId = subscriptionItem.plan.product;
            const product = await stripe.products.retrieve(productId);


            axios.post(`/api/generateUrl?customer_email=${customer.email}`)
            .then((res: any) => {
                setUserId(res.data.user.id)
                setVerificationToken(res.data.user.verification_token)

            })
            .catch((err: any) => {
              console.log('err from stripe billing', err)
            })

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
        if (query) {
            const sessionId = query.get('session-id');
            if (sessionId) {
                getSessionData(sessionId);
            }
        }
    }, []);




    const handleSubmit = (e:any) => {
        e.preventDefault()

        const newValidationErrors:any = {};

        
        if (!password) {
        newValidationErrors.password = 'Password is required';
        }
        if (!confirmPassword) {
        newValidationErrors.confirmPassword = 'Confirm Password is required';
        }

        if (Object.keys(newValidationErrors).length > 0) {
        setValidationErrors(newValidationErrors);
        return;
        }

        setBtnLoading(true)

        let payload = {
            password: password,
            confirm_password: confirmPassword,
            userId: user_id,
            token: verification_token,
        }

        axios.post('/api/invitation', payload)
            .then((res) => {
                setBtnLoading(false)
                toast.success(res.data.message);
                setShowRedirection(true)
                Helpers.setAccessToken(res.data.token)
                Helpers.setUser(res.data.user)
                setTimeout(() => {
                    router.push({
                        pathname: "/",
                    });
                }, 3000);
            })
            .catch(err => {
                console.log('err=',err.response.data.message)
                setBtnLoading(false)
                toast.error(err.response.data.message);
            });
    };


    const handlePasswordChange = (e:any) => {
      
        const { name, value } = e.target;
    
        setPassword(value);

        setValidationErrors((prevValidationErrors:any) => ({
            ...prevValidationErrors,
            password: '',
          }));
    };

    const handleConfirmPasswordChange = (e:any) => {
     
        const { name, value } = e.target;
    
        setConfirmPassword(value);

        setValidationErrors((prevValidationErrors:any) => ({
            ...prevValidationErrors,
            confirmPassword: '',
          }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div>Loading...</div>
                </div>
            ) : (
                <div className='confirmation-page-container'>
                    <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div>
                            <div style={{ textAlign: 'center', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid green', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ fontSize: '24px', color: 'green' }}>&#10004;</div>
                                </div>
                                <h3 style={{ color: 'black' }}>Thanks for subscribing</h3>
                                <p>A payment of {`$${(sessionSubscription.plan.amount / 100).toFixed(2)}`} will appear on your statement.</p>



                            </div>
                        </div>
                    </div>

                    <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.05)' }}>
                        <div className="complete-registration">
                            {showRedirection && (
                                <div style={{textAlign: 'center'}} className="mt-3">
                                    <p style={{ fontSize: '22px' }}>You will be redirected to dashboard ...</p>
                                </div>
                            )}
                            <div className="logo">
                                <p>Set Password</p>
                            </div>

                            <form onSubmit={handleSubmit} className='registration-form'>
                                <div className="sign-input">

                                    <div className={`input-group login-page-password ${isFocused ? 'focused' : ''}`}>
                                        <input
                                            type={showPassword ? 'text' : 'password'} className="form-control"
                                            aria-describedby="emailHelp" placeholder="Password"
                                            value={password} onChange={handlePasswordChange}
                                            onFocus={() => setIsFocused(true)} 
                                            onBlur={() => setIsFocused(false)}
                                        />
                                        <span className="input-group-text" id="basic-addon1" 
                                            onClick={togglePasswordVisibility}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </span>
                                    </div>
                                    <span className="signup-error-message">{validationErrors.password}</span>
                                    

                                    <div className={`input-group login-page-password 
                                        ${isFocusedConfirmPassword ? 'focused' : ''}`}>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="form-control" value={confirmPassword}
                                            aria-describedby="emailHelp" placeholder="Confirm Password"
                                            onChange={handleConfirmPasswordChange}
                                            onFocus={() => setIsFocusedConfirmPassword(true)} 
                                            onBlur={() => setIsFocusedConfirmPassword(false)}
                                        />
                                        <span className="input-group-text" id="basic-addon1" 
                                            onClick={toggleConfirmPasswordVisibility}>
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </span>
                                    </div>
                                    <span className="signup-error-message">{validationErrors.confirmPassword}</span>

                                </div>

                                <div className="complete-registration-btn reset-page-btn">
                                    <button type="submit" disabled={btnLoading}>
                                        {btnLoading ? (
                                            <>
                                                Please Wait{" "}
                                                <span className="spinner-grow spinner-grow-sm ml-2"
                                                    role="status" aria-hidden="true">
                                                </span>
                                            </>
                                        ) : (
                                            <>Complete Account</>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mb-3 mt-3 text-center">
                                <p>Already have an account? <Link className='text-base' href={`/login`}>Login</Link></p>
                            </div>

                            <ToastContainer autoClose={1500} />
                        </div>
                    </div>


                </div>
            )}
        </>
    )
}

export default ConfirmationPage
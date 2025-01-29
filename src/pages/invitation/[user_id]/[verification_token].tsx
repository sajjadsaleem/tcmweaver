// pages/dashboard/index.js (Dashboard page)

import React, { useRef, useState, useEffect } from "react";
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

import { useRouter } from "next/router";

import LayoutWrapper from "@/pages/components/LayoutWrapper";
import AuthLayout from "@/pages/components/AuthLayout";
import { TextField, InputAdornment, IconButton, Icon, Button, Grid, Paper, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UserVerificationPage = () => {
    const router = useRouter()
    const { user_id, verification_token } = router.query;
    const [btnLoading, setBtnLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false)
    const [showRedirection , setShowRedirection] = useState(false)
    const [validationErrors, setValidationErrors] = useState<any>({
        // fullname: '',
        password: '',
        confirmPassword: '',
    });
    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false)
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [fullname , setFullname] = useState("")
    const [pageLoading, setPageLoading] = useState(true)
    const [tokenVerify, setTokenVerify] = useState(false)


    useEffect(() => {
        // Extract token from URL
        const url = window.location.href;
        const token = url.split('/')[5]; // Assuming the token is the last segment in the URL

        axios.post('/api/verifyInvitation', {token})
        .then((res) => {
            console.log('============res', res)
            setPageLoading(false)
            setTokenVerify(true)
        })
        .catch(err => {
            console.log('err=',err.response.data.message)
            toast.error(err.response.data.message);
            setPageLoading(false)
        });


      }, []);

    
    const handleSubmit = (e:any) => {
        e.preventDefault()

        const newValidationErrors:any = {};

        // if (!fullname) {
        // newValidationErrors.fullname = 'Full Name is required';
        // }
        
        if (!password) {
        newValidationErrors.password = 'Password is required';
        }
        if (!confirmPassword) {
        newValidationErrors.confirmPassword = 'Confirm Password is required';
        }

        if (Object.keys(newValidationErrors).length > 0) {
        // Validation failed, update state to display error messages
        setValidationErrors(newValidationErrors);
        return;
        }

        setBtnLoading(true)

        let payload = {
            // full_name: fullname,
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


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }


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

    return ( 
        <LayoutWrapper layout={AuthLayout} >
            {pageLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div>Loading...</div>
                </div>
            ):(
                <>
                    {tokenVerify ? (
                        <div className="complete-registration-page">
        
                        <Link href="/login" style={{textDecoration: 'none'}}>
                            <div className="logo">
                                <img src="/graph-logoold.png" alt="img" />
                                <p>TCM Weaver</p>
                            </div>
                        </Link>
    
                        <form onSubmit={handleSubmit} >
                            <div className="sign-input">
    
                                {/* <input type="text" className="form-control" aria-describedby="emailHelp"
                                    placeholder="Full Name" value={fullname} name="fullname"
                                    onChange={handleFullnameChange}
                                />
                                <span className="signup-error-message">{validationErrors.fullname}</span> */}
    
    
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
    
                            <div className="sign-btn reset-page-btn">
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
    
                        {showRedirection && (
                            <div style={{textAlign: 'center'}} className="mt-3">
                                <p>You will be redirected to login page ...</p>
                            </div>
                        )}
    
                        <div className="mb-3 mt-3 text-center">
                            <p>Already have an account? <Link className='text-base' href={`/login`}>Login</Link></p>
                        </div>
                        </div>
                    ): (
                        <div style={{marginTop: '5rem'}}>
                            <Link href="/login" style={{textDecoration: 'none'}}>
                                <div className="logo">
                                    <img src="/graph-logoold.png" alt="img" />
                                    <p>TCM Weaver</p>
                                </div>
                            </Link>
                            <div className="flex items-center justify-center min-h-screen mt-5">
                                <div className="text-center bg-white p-6">
                                    <p className="text-lg font-semibold text-red-600" style={{fontSize: '20px'}}>
                                        Password setup is already done or token is expired.
                                    </p>
                                    <p className="mt-2 text-gray-700" style={{fontSize: '20px'}}>
                                    Login to your account or{" "}
                                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                        reset password
                                    </Link>
                                    </p>
                                </div>
                                </div>
                        </div>
                    )}
                    <ToastContainer autoClose={1500} />

                </>
            )}

            
        </LayoutWrapper>
    );
};

export default UserVerificationPage;

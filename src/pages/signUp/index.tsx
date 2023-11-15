import React, { useState } from "react";
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

import { useRouter } from "next/router";

import LayoutWrapper from "@/pages/components/LayoutWrapper";
import AuthLayout from "@/pages/components/AuthLayout";
import * as Helpers from '../../util/Helpers'
import { FullPageComponentLoading } from '../../util/FullPageComponentLoading'
import { TextField, InputAdornment, IconButton, Icon, Button, Grid, Paper, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UserVerificationPage = () => {
    const router = useRouter()
    const { user_id, verification_token } = router.query;
    const [btnLoading, setBtnLoading] = useState(false)
    const [getFullPageComponentLoading, setFullPageComponentLoading] = useState(false);
    const [get_full_name, set_full_name] = useState("");
    const [get_phone_number, set_phone_number] = useState("");
    const [get_password, set_password] = useState("");
    const [get_confirm_password, set_confirm_password] = useState("");
    const [get_password_type, set_password_type] = useState(false)
    const [get_confirm_password_type, set_confirm_password_type] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
    });

    const [validationErrors, setValidationErrors] = useState<any>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showRedirection , setShowRedirection] = useState(false)

    // console.log('formData' , formData)


    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        setValidationErrors({
            ...validationErrors,
            [name]: '',
        });
    };

    const handleSubmit = (e:any) => {
        e.preventDefault()

        const newValidationErrors:any = {};
        if (!formData.fullName) {
        newValidationErrors.fullName = 'Full Name is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newValidationErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
        newValidationErrors.password = 'Password is required';
        }
        if (!formData.confirmPassword) {
        newValidationErrors.confirmPassword = 'Confirm Password is required';
        }

        if (Object.keys(newValidationErrors).length > 0) {
        // Validation failed, update state to display error messages
        setValidationErrors(newValidationErrors);
        return;
        }


        setBtnLoading(true)
        let payload = {
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword,
        }

        console.log('payload' , payload)
        axios.post('/api/auth/signUp', payload)
            .then((res) => {
                // setFullPageComponentLoading(false)
                setBtnLoading(false)
                toast.success(res.data.message);
                setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    showPassword: false,
                    showConfirmPassword: false,
                  });
                setShowRedirection(true)
                const timer = setTimeout(() => {
                    router.push('/login');
                  }, 5000);
            })
            .catch(err => {
                console.log('err=',err.response.data.message)
                // setFullPageComponentLoading(false)
                setBtnLoading(false)
                toast.error(err.response.data.message);
            });
    };

    const handleShowPassword = () => {
        setFormData({
          ...formData,
          showPassword: !formData.showPassword,
        });
    };

    const handleShowConfirmPassword = () => {
        setFormData({
          ...formData,
          showConfirmPassword: !formData.showConfirmPassword,
        });
    };
    
    

    return ( 
        <LayoutWrapper layout={AuthLayout} >
            <div className="signup-page-container">

                <div>
                    <Link href="/login" style={{textDecoration: 'none'}}>
                        <div className="signup-top">
                            <div>
                                <img src="/graph-logo.png" alt="img" />
                            </div>
                            <p>TCM Weaver</p>
                        </div>
                    </Link>
                </div>

                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="signup-page-input">
                            <input
                                type="text"
                                name="fullName"
                                className="form-control"
                                aria-describedby="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <span className="signup-error-message">{validationErrors.fullName}</span>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                aria-describedby="emailHelp"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <span className="signup-error-message">{validationErrors.email}</span>

                            <input
                                type={formData.showPassword ? 'text' : 'password'}
                                name="password"
                                className="form-control"
                                aria-describedby="passwordHelp"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span className="signup-error-message">{validationErrors.password}</span>

                            <input
                                type={formData.showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                className="form-control"
                                aria-describedby="passwordHelp"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span className="signup-error-message">{validationErrors.confirmPassword}</span>

                            <div className="sign-btn">
                                <button type="submit" disabled={btnLoading} onClick={handleSubmit}>
                                    {btnLoading ? (
                                    <>
                                        Please Wait{" "}
                                        <span
                                        className="spinner-grow spinner-grow-sm ml-2"
                                        role="status"
                                        aria-hidden="true"
                                        ></span>
                                    </>
                                    ) : (
                                    <>Sign up</>
                                    )}
                                </button>
                            </div>

                        </div>
                    </form>

                    {showRedirection ?(
                        <div style={{textAlign: 'center'}} className="mt-3">
                            <p>You will be redirected to login page ...</p>
                        </div>
                        ): (
                        <>
                        </>
                    )}

                </div> 
                                             
                <div className="mb-3 mt-3 text-center">
                    <p>Already have an account? <Link className='text-base' href={`/login`}>Sign in</Link></p>
                </div>
   
            </div>
            <ToastContainer autoClose={1500} />
        </LayoutWrapper>
    );
};

export default UserVerificationPage;

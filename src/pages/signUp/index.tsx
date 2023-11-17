import React, { useEffect, useRef, useState } from "react";
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

const Signup = () => {
    const router = useRouter()
    const [btnLoading, setBtnLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<any>({
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
    const [isFocusedPassword, setIsFocusedPassword] = useState(false);
    const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false)
    const [image, setImage] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const divRefPassword = useRef<any>(null);
    const divRefConfirmPassword = useRef<any>(null);

    // console.log(formData)


    useEffect(() => {
        document.addEventListener('click', handleClickOutside);    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        console.log(name , value)
        setFormData({
            ...formData,
            [name]: value,
        });

        setValidationErrors({
            ...validationErrors,
            [name]: '',
        });
    };

    const handleSubmit = async (e:any) => {
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
            image: imagePreviews[0]
        }

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
                setImagePreviews([])
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


    const togglePasswordVisibility = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(!showPassword);
        setIsFocusedPassword(true)
    };

    const toggleConfirmPasswordVisibility = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        setShowConfirmPassword(!showConfirmPassword);
        setIsFocusedConfirmPassword(true)
    };

    const handleClickOutside = (e: any) => {
        if (
          (divRefPassword.current && !divRefPassword.current.contains(e.target)) &&
          (divRefConfirmPassword.current && !divRefConfirmPassword.current.contains(e.target))
        ) {
          setIsFocusedConfirmPassword(false);
          setIsFocusedPassword(false);
        }
    };

    const handleImageChange = (e:any) => {
        const file = e.target.files[0];
        setImage(file);

        const previews:any = [];
        const reader = new FileReader();
        reader.onload = () => {
            console.log(reader.result)
            previews.push(reader.result);
            if (previews.length) {
            setImagePreviews(previews);
            }
        };

        reader.readAsDataURL(file);
     

        setFormData({
          ...formData,
          image: file,
        });
      
        // You may also want to reset validation errors for the image
        setValidationErrors({
          ...validationErrors,
          image: '',
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

                            <input type="file" name="image" onChange={handleImageChange} />
                            <div>
                                {imagePreviews?.map((preview, index) => (
                                    <img
                                    key={index}
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    style={{ width: "200px", height: "auto" }}
                                    />
                                ))}
                            </div>

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

                            <div ref={divRefPassword} className={`input-group login-page-password ${isFocusedPassword ? 'focused' : ''}`}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    name="password"
                                    aria-describedby="emailHelp"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocusedPassword(true)}
                                    onBlur={() => setIsFocusedPassword(false)}
                                />
                                <span className="input-group-text" id="basic-addon1" onClick={togglePasswordVisibility}>
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </span>
                            </div>
                            <span className="signup-error-message">{validationErrors.password}</span>

                            <div ref={divRefConfirmPassword} className={`input-group login-page-password ${isFocusedConfirmPassword ? 'focused' : ''}`}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-control"
                                    name="confirmPassword"
                                    aria-describedby="emailHelp"
                                    placeholder="Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocusedConfirmPassword(true)}
                                    onBlur={() => setIsFocusedConfirmPassword(false)}
                                />
                                <span className="input-group-text" id="basic-addon1" onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                </span>
                            </div>
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

export default Signup;

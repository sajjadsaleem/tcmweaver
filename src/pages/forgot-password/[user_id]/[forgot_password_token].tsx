// pages/dashboard/index.js (Dashboard page)

import React, { useContext, useEffect, useRef, useState } from "react";
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import * as Icon from "react-feather";
import { useRouter } from "next/router";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import LayoutWrapper from "@/pages/components/LayoutWrapper";
import AuthLayout from "@/pages/components/AuthLayout";
import * as Helpers from '../../../util/Helpers';
// import appLogo from '../../../images/logo.gif';
// import { FullPageComponentLoading } from '../../../util/FullPageComponentLoading'

const UserForgotPasswordPage = () => {
    const router = useRouter()
    const { user_id, forgot_password_token } = router.query;
    const [btnLoading, setBtnLoading] = useState(false)

    const [get_password, set_password] = useState("");
    const [get_confirm_password, set_confirm_password] = useState("");

    const [get_password_type, set_password_type] = useState(false)
    const [get_confirm_password_type, set_confirm_password_type] = useState(false)


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false)
    const [signUpBtnLoading, setSignUpBtnLoading] = useState(false)
    const [isFocused, setIsFocused] = useState(false);
    const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false)
    const [showRedirection , setShowRedirection] = useState(false)

    // console.log('password' , password , 'confirmpassword' , confirmPassword)

    // const submitBtn = () => {
    //     setBtnLoading(true)
    //     let payload = {
    //         password: get_password,
    //         confirm_password: get_confirm_password,
    //         user_id: user_id,
    //         forgot_password_token: forgot_password_token,
    //     }
    //     axios.post('/api/auth/reset-password', payload)
    //         .then((res) => {
    //             setBtnLoading(false)
    //             toast.success(res.data.message, Helpers.toastSettings());
    //             router.push('/login')
    //         })
    //         .catch(err => {
    //             console.log('err=', err.response.data)
    //             setBtnLoading(false)
    //             Helpers.catchFunction(err)
    //         });
    // };



    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setBtnLoading(true);

        let payload = {
            password: password,
            confirm_password: confirmPassword,
            user_id: user_id,
            forgot_password_token: forgot_password_token,
        }

        axios.post('/api/auth/reset-password', payload)
            .then((res) => {
                setBtnLoading(false)
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 1500,
                    pauseOnHover: true,
                    theme: "colored",
                });

                setShowRedirection(true)

                

                setTimeout(()=> {
                    router.push('/login')
                },5000)

                
            })
            .catch(err => {
                console.log('err=',err.response.data)
                setBtnLoading(false)
            });
        


    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <>
            <LayoutWrapper layout={AuthLayout} >
                <div className="reset-password-credentials">
                    <div className="logo">
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <div>
                                <img src="/graph-logoold.png" alt="img" />
                            </div>
                        </Link>
                        <Link href="/login" style={{ textDecoration: 'none' }}>
                            <p>TCM Weaver</p>
                        </Link>
                    </div>

                    <div>
                        <form 
                            onSubmit={handleSubmit}
                        >
                            <div className="sign-input">
                                <div className={`input-group login-page-password 
                                        ${isFocused ? 'focused' : ''}`}>
                                    <input
                                        type={showPassword ? 'text' : 'password'} className="form-control"
                                        aria-describedby="emailHelp" placeholder="Password"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setIsFocused(true)} 
                                        onBlur={() => setIsFocused(false)}
                                    />
                                    <span className="input-group-text" id="basic-addon1" 
                                        onClick={togglePasswordVisibility}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </div>
                                

                                <div className={`input-group login-page-password 
                                    ${isFocusedConfirmPassword ? 'focused' : ''}`}>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="form-control" value={confirmPassword}
                                        aria-describedby="emailHelp" placeholder="Confirm Password"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        onFocus={() => setIsFocusedConfirmPassword(true)} 
                                        onBlur={() => setIsFocusedConfirmPassword(false)}
                                    />
                                    <span className="input-group-text" id="basic-addon1" 
                                        onClick={toggleConfirmPasswordVisibility}>
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </div>

                            </div>
                            <div className="sign-btn reset-page-btn">
                                <button type="submit" disabled={btnLoading}
                                //  onClick={handleSubmit}
                                 >
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
                                        <>Reset Password</>
                                    )}
                                </button>
                            </div>
                        </form>

                        {showRedirection ? (
                            <div style={{textAlign: 'center'}} className="mt-3">
                                <p>You will be redirected to login page ...</p>
                            </div>
                            ): (
                            <>
                            </>
                        )}
                    </div>











                    {/* <div className='authForm'>

                        <div className="mb-3">
                            <label for="password" className="form-label">Password</label>
                            <div className="inputIcon">
                                <input type={get_password_type ? ("text") : ("password")} className="form-control" id="password" value={get_password} onChange={e => set_password(e.target.value)} />
                                <div className="inputIcons">
                                    {
                                        get_password_type ?
                                            (
                                                <button type="button" onClick={() => { set_password_type(false) }} className="eyeOff"><Icon.EyeOff /></button>
                                            ) : (
                                                <button type="button" onClick={() => { set_password_type(true) }} className="eye"><Icon.Eye /></button>
                                            )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label for="confirm_password" className="form-label">Confirm Password</label>
                            <div className="inputIcon">
                                <input type={get_confirm_password_type ? ("text") : ("password")} className="form-control" id="confirm_password" value={get_confirm_password} onChange={e => set_confirm_password(e.target.value)} />
                                <div className="inputIcons">
                                    {
                                        get_confirm_password_type ?
                                            (
                                                <button type="button" onClick={() => { set_confirm_password_type(false) }} className="eyeOff"><Icon.EyeOff /></button>
                                            ) : (
                                                <button type="button" onClick={() => { set_confirm_password_type(true) }} className="eye"><Icon.Eye /></button>
                                            )
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="d-grid mb-4">
                            <button type="submit" class="btn btn-primary btn-block" disabled={btnLoading} onClick={submitBtn}>
                                {
                                    btnLoading ?
                                        (
                                            <>Please Wait <span className="spinner-grow spinner-grow-sm ml-2" role="status" aria-hidden="true"></span></>
                                        ) : (
                                            <>Reset Password</>
                                        )
                                }
                            </button>
                        </div>

                        <div className="mb-3 text-center">
                            <p>Already have an account? <Link className='text-base' href={`/login`}>Login</Link></p>
                        </div>
                    </div> */}

                    <ToastContainer />

                </div>
            </LayoutWrapper>
        </>
    );
};

export default UserForgotPasswordPage;

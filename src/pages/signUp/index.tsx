// pages/dashboard/index.js (Dashboard page)

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
    const [showRedirection , setShowRedirection] = useState(false)
    // console.log('formData' , formData)


    const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
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
    
    const handleSubmit = (e:any) => {
        e.preventDefault()
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

    return ( 
        <LayoutWrapper layout={AuthLayout} >
            <div>
                <div>
                    <Link href="/login" style={{ textDecoration: 'none' }}>
                        <div className="user-invitation-heading">
                            <div>
                                <img src="/graph-logo.png" alt="img" />
                            </div>
                            <p>TCM Weaver</p>
                        </div>
                    </Link>

                    <Grid container justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
                        <Grid item>
                            <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px' }}>
                                <Typography variant="h5" gutterBottom>
                                    Sign Up
                                </Typography>
                                <form onSubmit={handleSubmit}>
                                    <TextField
                                      label="Full Name"
                                      name="fullName"
                                      value={formData.fullName}
                                      onChange={handleChange}
                                      fullWidth
                                      margin="normal"
                                      size="small"
                                      required
                                    />

                                    <TextField
                                      label="Email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleChange}
                                      fullWidth
                                      margin="normal"
                                      size="small"
                                      required
                                    />

                                    <TextField
                                        label="Password"
                                        name="password"
                                        type={formData.showPassword ? 'text' : 'password'} // Toggle password visibility
                                        value={formData.password}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowPassword}>
                                                {formData.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type={formData.showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowConfirmPassword}>
                                                {formData.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <div className="d-grid mb-4 mt-4">
                                        <button type="submit" className="btn btn-primary btn-block" disabled={btnLoading} >
                                            {
                                                btnLoading ?
                                                (
                                                    <>Please Wait <span className="spinner-grow spinner-grow-sm ml-2" role="status" aria-hidden="true"></span></>
                                                ) : (
                                                    <>Submit</>
                                                )
                                            }
                                        </button>
                                    </div>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>

                    {showRedirection ?
                        (<div style={{textAlign: 'center'}}>
                            <p>You will be redirected to login page ...</p>
                        </div>): (<></>
                    )}
                </div> 
                                             
                <div className="mb-3 text-center">
                    <p>Already have an account? <Link className='text-base' href={`/login`}>Sign in</Link></p>
                </div>

                
                
            </div>
            <ToastContainer autoClose={1500} />
        </LayoutWrapper>
    );
};

export default UserVerificationPage;

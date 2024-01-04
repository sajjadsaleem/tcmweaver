import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutWrapper from "../components/LayoutWrapper";
import AuthLayout from '../components/AuthLayout';
import * as Helpers from '../../util/Helpers'
import { IconButton, Input, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [signUpBtnLoading , setSignUpBtnLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false);


  // Check to see if this is a redirect back from Checkout
  // useEffect(() => {
  //   const query = new URLSearchParams(window.location.search);
  //   if(query){
  //     const sessionId = query.get('session_id');
  //     // console.log('sessionid' , sessionId)

    
  //     // console.log('query' , query)
  //     if (query.get('success')) {
  //       console.log('Order placed! You will receive an email confirmation.');
  //     }

  //     if (query.get('canceled')) {
  //       console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
  //     }
  //   }
  // }, []);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!email || !password) {
      // Display an error message or handle the case where fields are empty
      console.log("Email and password are required.");
      return;
    }
    setBtnLoading(true);


    let payload = {
      email: email,
      password: password,
    };

    axios
      .post("/api/auth/login", payload)
      .then((res) => {
        // console.log('res: ' , res.data)
        setBtnLoading(false);
        Helpers.setAccessToken(res.data.token)
        Helpers.setUser(res.data.user)
        router.push({
          pathname: "/",
          // query: { dashboard: true },
        });
      })
      .catch((err) => {
        console.log("err=", err.response.data);
        setBtnLoading(false);
        toast("Login Failed", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          progress: undefined,
          theme: "light",
        });
        
      });
  };

  const handleSignUpBtn = async () => {
    setSignUpBtnLoading(true)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LayoutWrapper layout={AuthLayout}>
      <div className="login-page-container">
        <div className="logo">
          <img src="/graph-logoold.png" alt="img" />
          <p>TCM Weaver</p>
        </div>
        
     
          <form onSubmit={handleSubmit}>
            <div className="sign-input">
              <input
                type="email"
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className={`input-group login-page-password ${isFocused ? 'focused' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <span className="input-group-text" id="basic-addon1" onClick={togglePasswordVisibility}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </span>
              </div>

              <div className="forgot-psd">
                <Link className="forgot-password" href={`/forgotPassword`}>
                  Password Reset
                </Link>
              </div>
            </div>
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
                  <>Sign in</>
                )}
              </button>
            </div>

            <div className="sign-up">
            <p>or</p>
            <Link href={'/signUp'}>
              <button type="submit" disabled={signUpBtnLoading} onClick={handleSignUpBtn}>
                {signUpBtnLoading ? (
                  <>
                    Please Wait{" "}
                    <span className="spinner-grow spinner-grow-sm ml-2" role="status" aria-hidden="true"></span>
                  </>
                ): (
                  <>Sign up</>
                )}
              </button>
            </Link>
            </div>


          </form>
          
        <ToastContainer />
      </div>
    </LayoutWrapper>
  );
};

export default Login;

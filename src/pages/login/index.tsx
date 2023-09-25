import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutWrapper from "../components/LayoutWrapper";
import AuthLayout from '../components/AuthLayout';
import * as Helpers from '../../util/Helpers'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    setBtnLoading(true);
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    let payload = {
      email: email,
      password: password,
    };

    axios
      .post("/api/auth/login", payload)
      .then((res) => {
        console.log('res: ' , res.data)
        setBtnLoading(false);
        Helpers.setAccessToken(res.data.token)
        Helpers.setUser(res.data.user)
        router.push({
          pathname: "/",
          query: { dashboard: true }, // Add 'dashboard: true' as a query parameter
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

  return (
    <LayoutWrapper layout={AuthLayout}>
      <div className="account-page">
        <div className="logo">
          <div>
            <img src="/graph-logo.png" alt="img" />
          </div>
          <p>TCM Weaver</p>
        </div>
        <div>
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
              <input
                type="password"
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="forgot-psd">
                <Link className="forgot-password" href={`/forgotPassword`}>
                  Password Reset
                </Link>
              </div>
            </div>
            <div className="sign-btn">
              {/* <button type="submit">Sign in</button> */}
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
          </form>

          <div className="sign-up">
            <p>or</p>
            <button type="submit">Sign up</button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </LayoutWrapper>
  );
};

export default Login;

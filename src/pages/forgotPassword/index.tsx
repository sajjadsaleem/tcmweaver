import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
// import axios from 'axios';
// import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

// import LayoutWrapper from './components/global/LayoutWrapper';
// import AuthLayout from './components/global/AuthLayout';
// import * as Helpers from '../util/Helpers';
// import appLogo from '../images/logo.gif';

const LoginPage = () => {
  const router = useRouter();

  const [btnLoading, setBtnLoading] = useState(false);

  const [get_email, set_email] = useState("");

  const submitBtn = () => {
    setBtnLoading(true);
    let payload = {
      email: get_email,
    };
    //   axios.post('/api/auth/forgot-password', payload)
    //       .then((res) => {
    //           setBtnLoading(false)
    //           toast.success(res.data.message, Helpers.toastSettings());
    //       })
    //       .catch(err => {
    //           console.log('err=',err.response.data)
    //           setBtnLoading(false)
    //           Helpers.catchFunction(err)
    //       });
  };

  return (
    <>
      {/* <LayoutWrapper layout={AuthLayout} > */}
      <div className="container">
        <div className="authForm">
          <div className="mb-40 text-center">
            <Link href="/" className="logo">
              {/* <img src={appLogo.src} alt="Logo" /> */}
            </Link>
          </div>

          <div className="mb-3">
            {/* <label for="email" className="form-label">
              Email
            </label> */}
            <input
              type="email"
              className="form-control"
              id="email"
              value={get_email}
              onChange={(e) => set_email(e.target.value)}
            />
          </div>

          <div className="d-grid mb-4">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={btnLoading}
              onClick={submitBtn}
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

          <div className="mb-3 text-center">
            <p>
              Already have an account?{" "}
              <Link className="text-base" href={`/login`}>
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* </LayoutWrapper> */}
    </>
  );
};

export default LoginPage;

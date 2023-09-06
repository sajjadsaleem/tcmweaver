// pages/dashboard/index.js (Dashboard page)

import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";

// import LayoutWrapper from './components/global/LayoutWrapper';
// import AuthLayout from './components/global/AuthLayout';
// import * as Helpers from '../util/Helpers';
// import appLogo from "../images/logo.gif";

const SignUpPage = () => {
  const router = useRouter();
  const [btnLoading, setBtnLoading] = useState(false);

  const [get_full_name, set_full_name] = useState("");
  const [get_phone_number, set_phone_number] = useState("");
  const [get_email, set_email] = useState("");
  const [get_password, set_password] = useState("");
  const [get_confirm_password, set_confirm_password] = useState("");

  //   const phoneNumber = (txt) => {
  //     set_phone_number(Helpers.phoneFormat(txt));
  //   };

  const submitBtn = () => {
    setBtnLoading(true);
    // let payload = {
    //   full_name: get_full_name,
    //   phone_number: get_phone_number,
    //   email: get_email,
    //   password: get_password,
    //   confirm_password: get_confirm_password,
    // };
    // axios
    //   .post("/api/auth/signup", payload)
    //   .then((res) => {
    //     setBtnLoading(false);
    //     toast.success(res.data.message, Helpers.toastSettings());
    //     router.push("/login");
    //   })
    //   .catch((err) => {
    //     console.log("err=", err.response.data);
    //     setBtnLoading(false);
    //     Helpers.catchFunction(err);
    //   });
  };

  return (
    <>
      {/* <LayoutWrapper layout={AuthLayout} > */}
      <div className="container">
        <div className="authForm">
          <div className="mb-40 text-center">
            <Link href="/" className="logo">
              <img src="/graph-logo.png" alt="img" className="signup-logo" />
            </Link>
          </div>

          <div className="mb-3">
            <label htmlFor="full_name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              className="form-control"
              id="full_name"
              value={get_full_name}
              onChange={(e) => set_full_name(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">
              Phone Number
            </label>
            {/* <input type="text" className="form-control" id="phone_number" value={get_phone_number} onChange={e => set_phone_number(e.target.value)} /> */}
            <input
              type="text"
              className="form-control"
              id="phone_number"
              value={get_phone_number}
              // onChange={(e) => phoneNumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={get_email}
              onChange={(e) => set_email(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={get_password}
              onChange={(e) => set_password(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirm_password" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirm_password"
              value={get_confirm_password}
              onChange={(e) => set_confirm_password(e.target.value)}
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
                <>Sign Up</>
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

export default SignUpPage;

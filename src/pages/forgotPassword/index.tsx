import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import LayoutWrapper from "@/pages/components/LayoutWrapper";
import AuthLayout from "@/pages/components/AuthLayout";

import * as Helpers from '../../util/Helpers';


const ResetPasswordPage = () => {
  const router = useRouter();

  const [btnLoading, setBtnLoading] = useState(false);

  const [get_email, set_email] = useState("");
  const [validationErrors, setValidationErrors] = useState<any>({email: '',password: '',confirmPassword: '',});

  const [formData, setFormData] = useState<any>({email: '',password: '',confirmPassword: '',});

  const submitBtn = () => {
    setBtnLoading(true);
    let payload = {
      email: get_email,
    };
      axios.post('/api/auth/forgot-password', payload)
          .then((res) => {
              setBtnLoading(false)
              toast.success(res.data.message, {
                position: "top-right",
                autoClose: 1500,
                pauseOnHover: true,
                theme: "colored",
              });
          })
          .catch(err => {
              console.log('err=',err.response.data)
              setBtnLoading(false)
              // Helpers.catchFunction(err)
          });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault()

    const newValidationErrors:any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        newValidationErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newValidationErrors).length > 0) {
      // Validation failed, update state to display error messages
      setValidationErrors(newValidationErrors);
      return;
    }


    setBtnLoading(true)

    let payload = {
      email: formData.email,
    }

    axios.post('/api/auth/forgot-password', payload)
      .then((res) => {
          setBtnLoading(false)
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 1500,
            pauseOnHover: true,
            theme: "colored",
          });
      })
      .catch(err => {
          console.log('err=',err.response.data)
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 1500,
            pauseOnHover: true,
            theme: "colored",
          });
          setBtnLoading(false)
      });
  }

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value,});

    setValidationErrors({ ...validationErrors,[name]: '', });
  };

  return (
    <>
      <LayoutWrapper layout={AuthLayout} >
        <div className="forgot-password-container">

          <Link href="/login" style={{textDecoration: 'none'}}>
              <div className="logo">
                <img src="/graph-logoold.png" alt="img" /> 
                <p>TCM Weaver</p>
              </div>
          </Link>
          
          <form onSubmit={handleSubmit}>
            <div className="forgotpassword-page-input">
              <input type="email" name="email" className="form-control" aria-describedby="emailHelp"
                  placeholder="Email" value={formData.email} onChange={handleChange} required
              />
              <span className="signup-error-message">{validationErrors.email}</span>
            </div>

            <div className="sign-btn">
              <button type="submit" disabled={btnLoading} onClick={handleSubmit}>
                {btnLoading ? (
                  <>
                    Please Wait{" "}
                    <span className="spinner-grow spinner-grow-sm ml-2" role="status" aria-hidden="true" ></span>
                  </>
                ) : (
                  <>Email Me</>
                )}
              </button>
            </div>

          </form>
        
          <div className="mb-3 mt-3 text-center">
              <p>Already have an account?{" "}<Link className="text-base" href={`/login`}>Login</Link></p>
          </div>

        </div>
        <ToastContainer />
      </LayoutWrapper>
    </>
  );
};

export default ResetPasswordPage;

// import React, { ReactNode } from "react";
// import { useRouter } from "next/router";

export interface AdminLayoutProps {
  children: ReactNode;
}

// const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
//   const router = useRouter();

//   return <div className="content-wrapper">{children}</div>;
// };

// export default AdminLayout;



// pages/components/global/AdminLayout.js

import React, { useState, useEffect , ReactNode } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux'

import {
  stAccessTokenVerify
} from '../../store/apps/auth'

import LayoutWrapper from './LayoutWrapper';
// import * as Helpers from '../../../util/Helpers'
// import { ComponentLoading } from '../../../util/ComponentLoading'
import { FullPageComponentLoading } from '../../util/FullPageComponentLoading'

// ** Store Imports
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState, AppDispatch } from "src/store"
// import {
//   stAccessTokenVerify
// } from '../../../store/apps/auth'

// import Sidebar from './Sidebar';
// import TopBar from './TopBar';


const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch()

  const [getFullPageComponentLoading, setFullPageComponentLoading] = useState(true);


  const init = () => {
    setFullPageComponentLoading(true)
    let payload = {
        token: localStorage.getItem("ACCESS_TOKEN")
    }
    axios.post('/api/auth/verify-token', payload)
        .then((res) => {
            if(!res.data.tokenResult){
              router.push('/login');
            } 
            else {
              setFullPageComponentLoading(false)
            }
            dispatch(stAccessTokenVerify({
              user: res.data.user,
              user_permissions: res.data.user_permissions,
              user_role: res.data.user_role,
              user_package: res.data.package
            }))
           
        })
        .catch(err => {
            console.log('err=',err.response.data)
            router.push('/login');
            // setFullPageComponentLoading(false)
            // Helpers.catchFunction(err)
        });
  }

  useEffect(() => {
    init()
  }, [])

  // useEffect(() => {
  //   dispatch(stAccessTokenVerify())
  // }, [dispatch])

 

  return (
    <>
      {getFullPageComponentLoading ? (
        <FullPageComponentLoading></FullPageComponentLoading>
      ):(
        <div className="content-wrapper">{children}</div>
      )}

    </>
     
  );
};

export default AdminLayout;

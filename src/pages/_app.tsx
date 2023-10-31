import React from "react";
import AdminLayout from "./components/AdminLayout";
import Head from "next/head";

import "./style.css";
import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { store } from '../store/index';

interface DashboardProps {
  Component: React.ComponentType;
  pageProps: any; // Adjust the type as per your actual pageProps type
}

const Dashboard: React.FC<DashboardProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>TCM Weaver</title>
        <meta name="description" content={`Tcm Weaver – Dashboard`} />
        <meta name="keywords" content="Tcm Weaver Next Js Template" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
    </>
  );
};

export default Dashboard;

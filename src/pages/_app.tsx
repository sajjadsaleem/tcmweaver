import React from "react";
import AdminLayout from "./components/AdminLayout";
import Head from "next/head";

import "./style.css";
import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface DashboardProps {
  Component: React.ComponentType;
  pageProps: any; // Adjust the type as per your actual pageProps type
}

const Dashboard: React.FC<DashboardProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>The Mail Drop CRM</title>
        <meta name="description" content={`The Mail Drop CRM – Dashboard`} />
        <meta name="keywords" content="The Mail Drop CRM Next Js Template" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default Dashboard;

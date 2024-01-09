import React from "react";
import AdminLayout from "./components/AdminLayout";
import Head from "next/head";
import localFont from 'next/font/local'

import "./style.css";
import "../css/custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import { store } from '../store/index';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DashboardProps {
  Component: React.ComponentType;
  pageProps: any;
}

const myFont = localFont({
  src: [
    {
      path: '../../public/fonts/GlacialIndifference-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/GlacialIndifference-Italic.otf',
      weight: '400',
      style: 'italic',

    },
    // {
    //   path: '../../public/fonts/GlacialIndifference-Bold.otf',
    //   weight: '700',
    //   style: 'normal'
    // }
  ]
})

const Dashboard: React.FC<DashboardProps> = ({ Component, pageProps }) => {
  return (
    <div className={myFont.className}>

      <Head>
        <title>TCM Weaver</title>
        <meta name="description" content={`Tcm Weaver – Dashboard`} />
        <meta name="keywords" content="Tcm Weaver Next Js Template" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>

      <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </DndProvider>
    </div>
  );
};

export default Dashboard;

"use client";
import React, { useState, useEffect } from "react";
import LayoutWrapper from "./components/LayoutWrapper";
import AdminLayout from "./components/AdminLayout";

import Sidebar from "./components/Sidebar";

const Page = () => {
  return (
    <LayoutWrapper layout={AdminLayout}>
      <div className="wrapper">
        <Sidebar />
      </div>
    </LayoutWrapper>
  );
};

export default Page;

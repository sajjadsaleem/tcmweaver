"use client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { BsFolder2 } from "react-icons/bs";
import { Fzf, FzfOptions, byLengthAsc } from "fzf";
import LayoutWrapper from "./components/LayoutWrapper";
import AdminLayout from "./components/AdminLayout";

import Sidebar from "./components/Sidebar";

const Page = () => {
  const [triggerChange, setTriggerChange] = useState(false);
  // const handleThemeChange = () => {
  //   console.log("now in index file");
  //   setTriggerChange(!triggerChange);
  //   // handleThemeChangeInMain();
  // };

  

  return (
    <LayoutWrapper layout={AdminLayout}>
      <div className="wrapper">
        <Sidebar />
      </div>
    </LayoutWrapper>
  );
};

export default Page;

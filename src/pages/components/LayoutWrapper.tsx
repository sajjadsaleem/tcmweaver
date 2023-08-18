import React, { ReactNode } from "react";

interface LayoutWrapperProps {
  layout?: React.ComponentType;
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ layout: Layout = React.Fragment, children }) => {
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;

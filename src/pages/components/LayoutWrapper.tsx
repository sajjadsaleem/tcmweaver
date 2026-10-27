import React, { ReactNode } from "react";
import AdminLayout, { AdminLayoutProps } from "./AdminLayout";

interface LayoutWrapperProps {
  layout?: React.ComponentType<AdminLayoutProps>;
  children: ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({
  layout: Layout = React.Fragment,
  children,
}) => {
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;

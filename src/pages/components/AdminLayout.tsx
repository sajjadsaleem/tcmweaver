import React, { ReactNode } from "react";
import { useRouter } from "next/router";

export interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();

  return <div className="content-wrapper">{children}</div>;
};

export default AdminLayout;

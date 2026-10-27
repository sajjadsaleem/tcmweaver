

import React, { useState, useEffect , ReactNode } from 'react';


const AuthLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    
  const [user, setUser] = useState({
    name: 'John Smith'
  });

  return (
    <>
        <div className="auth-wrapper">
            {children}
        </div>
    </>
  );
};

export default AuthLayout;

import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">{children}</div>
  );
};

export default Layout;

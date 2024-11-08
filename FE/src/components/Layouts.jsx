import React from 'react';

const Layout = ({ children }) => {
  return (
    // mx - auto : 요소가 항상 가운데 정렬
    // max-w-7xl : 최대 너비 사이즈 7xl
    // sm:px-6 : 작은 화면(sm)에서 px-6(24px)
    // lg:px-8 : 큰 화면(lg)에서 px-8(32px)
    <div className="mx-auto max-w-13xl px-2 sm:px-6 lg:px-24">{children}</div>
  );
};

export default Layout;

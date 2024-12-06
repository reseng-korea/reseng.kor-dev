import React from 'react';
import { useNavigateTo } from '../hooks/useNavigateTo';

const SubNavbar = ({ items, activePage, mainCategory }) => {
  const { navigateTo } = useNavigateTo();

  return (
    <div className="w-full">
      <div className="mt-28 mb-12 text-5xl font-bold slide-up">
        {mainCategory}
      </div>
      <div className="flex justify-center space-x-4 mt-2">
        {items.map(({ label, route }) => (
          <button
            key={label}
            onClick={() => navigateTo(route)}
            className={`flex items-center justify-center w-40 h-10 ${
              activePage === label
                ? 'font-bold text-primary border-0 border-b-2 border-primary rounded-none bg-transition'
                : 'text-black hover:text-primary border-none outline-none bg-transition'
            }`}
          >
            <span className="mb-2 slide-up">{label}</span>
          </button>
        ))}
      </div>
      <hr className="w-full mb-12 border-t border-gray1 hr-expand" />
    </div>
  );
};

export default SubNavbar;

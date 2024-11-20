import React from 'react';

// 이미지
import logo from '../assets/logo.png';

import { useNavigateTo } from './../hooks/useNavigateTo';

const Footer = () => {
  const { navigateTo, routes } = useNavigateTo();

  return (
    <footer className="flex justify-center py-8 bg-gray4">
      <div className="flex items-center w-3/5">
        <div className="container flex flex-col items-start justify-center mx-auto md:flex-row">
          <div className="text-left md:ml-8">
            <h2 className="mb-2 text-sm font-bold text-gray1 mb-4">
              주식회사 리앤생
            </h2>
            <p className="mb-2 text-gray3 text-sm">
              사업자 등록번호 : 837-88-03260 | 대표 : 이승현
            </p>
            <p className="mb-2 text-gray3 text-sm">
              41931 대구광역시 중구 국채보상로 488, 8층 (동산동, 섬유회관)
            </p>
            <p className="mb-2 text-gray3 text-sm">
              Tel : 070-4156-7809 | Fax : (053) 252-6438 | Email :
              reseng.kor@gmail.com
            </p>
          </div>
        </div>
        <div className="container flex flex-col items-start justify-center mx-auto md:flex-row">
          <div className="flex flex-col justify-center items-center text-left md:ml-8">
            <a className="mb-2 text-gray3 font-bold text-sm" href="#" onClick={(e) => {e.preventDefault();navigateTo(routes.termsOfUse);}}>
              이용약관
            </a>
            <a className="mb-2 text-gray3 font-bold text-sm" href="#" onClick={(e) => {e.preventDefault();navigateTo(routes.privacyPolicy);}}>
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

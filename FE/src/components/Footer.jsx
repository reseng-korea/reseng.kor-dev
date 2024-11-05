import React from 'react';

// 이미지
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="py-8 bg-gray4">
      <div className="container flex flex-col items-start justify-start mx-auto md:flex-row">
        {/* 왼쪽: 이미지 */}
        <div className="justify-center mb-4 md:mb-0 mr-6">
          <img src={logo} alt="Logo" className="w-12" />
        </div>

        {/* 오른쪽: 4줄 문장 */}
        <div className="text-left md:ml-8">
          <h2 className="mb-2 text-lg font-bold text-gray1 mb-4">(주)리앤생</h2>
          <p className="mb-2 text-gray3 text-sm">
            사업자 등록번호 : 825-81-01881 | 대표 : 이오희
          </p>
          <p className="mb-2 text-gray3 text-sm">
            41931 대구광역시 중구 국채보상로 488, 8층 (동산동, 섬유회관)
          </p>
          <p className="mb-2 text-gray3 text-sm">
            Tel : (053) 252-6455/6454 | Fax : (053) 252-6438 | Email :
            reseng.kor@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

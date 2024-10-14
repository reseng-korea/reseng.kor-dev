import React from 'react';

// 이미지
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-[#D9D9D9] text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-start justify-start">
        {/* 왼쪽: 이미지 */}
        <div className="mb-4 md:mb-0 justify-center">
          <img src={logo} alt="Logo" className="w-20" />
        </div>

        {/* 오른쪽: 4줄 문장 */}
        <div className="text-left md:ml-8">
          <h2 className="mb-2 text-2xl text-black font-bold">(주)리앤생</h2>
          <p className="mb-2 text-[#535353]">
            사업자 등록번호 : 825-81-01881 | 대표 : 이오희
          </p>
          <p className="mb-2 text-[#535353]">
            41931 대구광역시 중구 국채보상로 488, 8층 (동산동, 섬유회관)
          </p>
          <p className="mb-2 text-[#535353]">
            Tel : (053) 252-6455/6454 | Fax : (053) 252-6438 | Email :
            reseng.kor@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

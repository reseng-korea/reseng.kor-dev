import React, { useState } from 'react';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import AddressSearch from '../../components/AddressSearch';
import { regionsData } from '../../data/regionsData';

const UserEdit = () => {
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const { navigateTo, routes } = useNavigateTo();

  const [selectedMetropolitan, setSelectedMetropolitan] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleMetropolitanChange = (e) => {
    setSelectedMetropolitan(e.target.value);
    setSelectedDistrict('');
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start min-h-screen px-3 py-2">
        <div className="flex flex-col items-center justify-center w-full">
          <SubNavbar
            items={navItems}
            activePage="회원 정보 수정"
            mainCategory="마이페이지"
          />
          {/* 메인 */}
          <div className="flex flex-col w-full max-w-2xl px-8 pt-4 pb-8 mx-auto">
            <span className="mb-4 text-left">
              안전한 서비스 이용을 위해 회원 정보를 최신 상태로 유지해 주세요.
            </span>
            <hr className="w-full mb-6 border-t border-gray-300" />

            {/* 이메일 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">이메일</label>
              <div className="flex items-center justify-center w-full mb-1 space-x-2">
                <input
                  type="email"
                  className="flex-grow p-2 mb-1 bg-placeHolder rounded-lg"
                  placeholder="nayeon0016@gmail.com"
                  readOnly
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-1 text-lg">비밀번호</label>
              <span className="self-start mb-2 text-xs text-gray3">
                영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
              </span>
              <input
                type="password"
                className="w-full p-2 mb-1 border rounded-lg"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">비밀번호 확인</label>
              <input
                type="password"
                className="w-full p-2 mb-1 border rounded-lg"
                placeholder="비밀번호를 한 번 더 입력해주세요"
              />
              <span className="self-start text-xs text-warning">
                비밀번호가 일치하지 않습니다.
              </span>
            </div>

            {/* 업체명 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">업체명</label>
              <input
                type="text"
                className="w-full p-2 mb-1 border rounded-lg"
                placeholder="업체명을 입력해주세요"
              />
            </div>

            {/* 대표자명 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">대표자명</label>
              <input
                type="text"
                className="w-full p-2 mb-1 border rounded-lg"
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* 휴대폰 번호 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">휴대폰 번호</label>
              <div className="flex items-center justify-center w-full mb-1 space-x-2">
                <input
                  type="tel"
                  maxLength="11"
                  className="flex-grow p-2 mb-1 border rounded-lg"
                  placeholder="숫자만 입력해주세요"
                />
                <button
                  type="submit"
                  className="flex-grow-0 px-4 py-2 mb-2 font-bold text-gray4 transition-colors duration-300 bg-transition border-gray4 rounded-lg hover:bg-primary hover:text-white"
                >
                  인증 요청
                </button>
              </div>
            </div>

            {/* 광역자치구 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">광역자치구</label>
              <select
                className="w-full p-2 mb-1 border rounded-lg"
                value={selectedMetropolitan}
                onChange={handleMetropolitanChange}
              >
                <option value="">광역자치구를 선택해주세요</option>
                {Object.keys(regionsData).map((metropolitan) => (
                  <option key={metropolitan} value={metropolitan}>
                    {metropolitan}
                  </option>
                ))}
              </select>
            </div>

            {/* 지역자치구 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="self-start mb-2 text-lg">지역자치구</label>
              <select
                className="w-full p-2 mb-1 border rounded-lg"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedMetropolitan}
              >
                <option value="">지역자치구를 선택해주세요</option>
                {selectedMetropolitan &&
                  regionsData[selectedMetropolitan].map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
              </select>
            </div>

            {/* 주소 */}
            <div>
              <AddressSearch />
            </div>

            <span className="mx-4 text-sm text-right text-gray2 cursor-pointer">
              탈퇴하기
            </span>

            {/* 회원 정보 수정 및 취소 버튼 */}
            <div className="flex items-center justify-center w-full px-3 py-2 mb-4 space-x-4">
              <button
                type="submit"
                className="w-1/3 px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
              >
                회원 정보 수정
              </button>
              <button
                type="submit"
                className="w-1/3 px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg hover:bg-primary hover:text-white"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserEdit;

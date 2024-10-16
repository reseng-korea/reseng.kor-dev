import React, { useState } from 'react';
import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import { regions } from './../data/regions';

import AddressSearch from '../auth/AddressSearch';

const UserEdit = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [selectedMetropolitan, setSelectedMetropolitan] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleMetropolitanChange = (e) => {
    setSelectedMetropolitan(e.target.value);
    setSelectedDistrict('');
  };

  return (
    <Layout>
      <div className="flex flex-col justify-start items-center px-3 py-2 min-h-screen pt-16">
        <div className="w-full flex flex-col items-center justify-center mb-1 space-x-2">
          {/* 카테고리 */}
          <div className="text-3xl font-bold mb-6">마이페이지</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.mypageMember)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">업체 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageManage)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">현수막 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOrder)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">현수막 발주</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageQr)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">QR 발생기</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageUserEdit)}
              className="w-30 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none"
            >
              <span className="text-[#2EA642] font-bold">회원 정보 수정</span>
            </button>
          </div>
          <hr className="w-full border-t border-[#99999] mb-6" />

          {/* 메인 */}
          <div className="w-full max-w-2xl pt-4 pb-8 px-8 flex flex-col  mx-auto">
            {/* shadow-md rounded-lg */}
            <span className="text-left mb-4">
              안전한 서비스 이용을 위해 회원 정보를 최신 상태로 유지해 주세요.
            </span>
            <hr className="w-full border-t border-gray-300 mb-6" />
            {/* 이메일 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">이메일</label>
              <div className="w-full flex items-center justify-center mb-1 space-x-2">
                <input
                  type="email"
                  className={`flex-grow bg-gray-200 rounded-lg p-2 mb-1`}
                  placeholder="이메일을 입력해주세요"
                  readOnly
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-1 self-start">비밀번호</label>
              <span className="self-start text-xs text-gray-500 mb-2">
                영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
              </span>
              <input
                type="password"
                className={`w-full border rounded-lg p-2 mb-1`}
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">비밀번호 확인</label>
              <input
                type="password"
                className={`w-full border rounded-lg p-2 mb-1`}
                placeholder="비밀번호를 한 번 더 입력해주세요"
              />
              <span className="self-start text-xs text-[#F75252]">
                비밀번호가 일치하지 않습니다.
              </span>
            </div>
            {/* 업체명 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">업체명</label>
              <input
                type="text"
                className={`w-full border rounded-lg p-2 mb-1`}
                placeholder="업체명을 입력해주세요"
              />
            </div>

            {/* 대표자명 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">대표자명</label>
              <input
                type="text"
                className={`w-full border rounded-lg p-2 mb-1`}
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* 휴대폰 번호 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">휴대폰 번호</label>
              <div className="w-full flex items-center justify-center mb-1 space-x-2">
                <input
                  type="tel"
                  maxLength="11"
                  // value={phone}
                  // onChange={handlePhoneChange}
                  className="flex-grow border rounded-lg p-2 mb-1"
                  placeholder="숫자만 입력해주세요"
                />
                <button
                  type="submit"
                  className="flex-grow-0 mb-2 bg-transition text-black border-[#999999] font-bold py-2 px-4 rounded-lg hover:text-white hover:bg-[#2EA642] transition-colors duration-300"
                >
                  인증 요청
                </button>
              </div>
            </div>

            {/* 광역자치구 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">광역자치구</label>
              <select
                className="border rounded-lg w-full p-2 mb-1"
                value={selectedMetropolitan}
                onChange={handleMetropolitanChange}
              >
                <option value="">광역자치구를 선택해주세요</option>
                {Object.keys(regions).map((metropolitan) => (
                  <option key={metropolitan} value={metropolitan}>
                    {metropolitan}
                  </option>
                ))}
              </select>
            </div>

            {/* 지역자치구 */}
            <div className="flex flex-col items-center px-3 py-2">
              <label className="text-lg mb-2 self-start">지역자치구</label>
              <select
                className="border rounded-lg w-full p-2 mb-1"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedMetropolitan}
              >
                <option value="">지역자치구를 선택해주세요</option>
                {selectedMetropolitan &&
                  regions[selectedMetropolitan].map((district) => (
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

            <span className="text-right mx-4 text-sm text-gray-300 cursor-pointer">
              탈퇴하기
            </span>

            {/* 회원가입 버튼 */}
            <div className="w-full mb-4 flex items-center justify-center px-3 py-2 space-x-4">
              <button
                type="submit"
                className="w-1/3 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-[#2EA642] transition-colors duration-300"
              >
                회원 정보 수정
              </button>
              <button
                type="submit"
                className="w-1/3 bg-white border-[#2EA642] text-[#2EA642] font-bold py-2 px-4 rounded-lg hover:bg-[#2EA642] hover:text-white transition-colors duration-300"
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

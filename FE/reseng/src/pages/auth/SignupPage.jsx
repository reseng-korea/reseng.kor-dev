import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { regions } from './../data/regions';

import Layout from '../../components/Layouts';
import AddressSearch from '../auth/AddressSearch';

const SignupPage = () => {
  const [selectedMetropolitan, setSelectedMetropolitan] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleMetropolitanChange = (e) => {
    setSelectedMetropolitan(e.target.value);
    setSelectedDistrict('');
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start pt-16">
        <div className="w-full max-w-2xl p-8 shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6">회원가입</h1>
          <hr className="w-full border-t-2 border-[#2EA642] mb-6" />

          {/* 이메일 */}
          <div className="flex flex-col items-center px-3 py-2">
            <label className="text-lg mb-2 self-start">이메일</label>
            <div className="w-full flex items-center justify-center mb-1 space-x-2">
              <input
                type="email"
                className={`flex-grow border rounded-lg p-2 mb-1`}
                placeholder="이메일을 입력해주세요"
              />
              <button
                type="submit"
                className="flex-grow-0 mb-2 bg-transition text-black border-[#999999] font-bold py-2 px-4 rounded-lg hover:text-white hover:bg-[#2EA642] transition-colors duration-300"
              >
                중복 확인
              </button>
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

          {/* 회원가입 버튼 */}
          <div className="flex flex-col items-center px-3 py-2">
            <button
              type="submit"
              className="w-full bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default SignupPage;

import React, { useState } from 'react';
import { regionsData } from '../../data/regionsData';
import Layout from '../../components/Layouts';
import AddressSearch from '../../components/AddressSearch';

const SignupPage = () => {
  const [selectedMetropolitan, setSelectedMetropolitan] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleMetropolitanChange = (e) => {
    setSelectedMetropolitan(e.target.value);
    setSelectedDistrict('');
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl p-8 rounded-lg shadow-md">
          <h1 className="pt-16 mb-6 text-2xl font-bold">회원가입</h1>

          <hr className="w-full mb-6 border-t-2 border-primary" />

          {/* 이메일 */}
          <div className="flex flex-col items-center px-3 py-2">
            <label className="self-start mb-2 text-lg">이메일</label>
            <div className="flex items-center justify-center w-full mb-1 space-x-2">
              <input
                type="email"
                className="flex-grow p-2 mb-1 border rounded-lg"
                placeholder="이메일을 입력해주세요"
              />
              <button
                type="submit"
                className="flex-grow-0 px-4 py-2 mb-2 font-bold text-gray4 transition-colors duration-300 bg-transition border-gray4 rounded-lg hover:bg-[#2EA642] hover:text-white"
              >
                중복 확인
              </button>
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

          {/* 회원가입 버튼 */}
          <div className="flex flex-col items-center px-3 py-2">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:bg-white hover:text-primary"
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

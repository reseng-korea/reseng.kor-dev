import React, { useState } from 'react';
import { regionsData } from '../../data/regionsData';
import Layout from '../../components/Layouts';
import AddressSearch from '../../components/AddressSearch';

const AddSignupPage = () => {
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
          <h1 className="pt-16 mb-6 text-2xl font-bold">회원 정보 추가 입력</h1>
          <span className="text-xs text-gray4 sm:text-sm">
            원활한 사용을 위해 추가 정보가 필요합니다. 필수 항목을 입력해
            주세요. 감사합니다 :)
          </span>
          <hr className="w-full mt-2 mb-6 border-t-2 border-primary" />

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
                className="flex-grow-0 px-4 py-2 mb-2 font-bold text-gray4 transition-colors duration-300 bg-transition border-gray4 rounded-lg hover:bg-primary hover:text-white"
              >
                중복 확인
              </button>
            </div>
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
              className="w-full px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddSignupPage;

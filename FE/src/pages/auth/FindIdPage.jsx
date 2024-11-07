import React, { useState } from 'react';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const FindIdPage = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 필터링
    const filteredValue = value.replace(/[^0-9]/g, '');
    setPhone(filteredValue);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-lg p-8">
        <h1 className="pt-16 mb-6 text-2xl font-bold">아이디 찾기</h1>
        <hr className="w-full mb-6 border-t-2 border-primary" />

        {/* 업체명 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">업체명</label>
          <input
            type="text"
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="업체명을 입력해주세요"
          />
          <span className="self-start text-xs text-warning">
            가입 시 등록한 업체명을 입력해주세요.
          </span>
        </div>

        {/* 휴대폰 번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">휴대폰 번호</label>
          <input
            type="tel"
            maxLength="11"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="숫자만 입력해주세요"
          />
          <span className="self-start text-xs text-warning">
            가입 시 등록한 휴대폰번호를 입력해주세요.
          </span>
        </div>

        {/* 아이디 찾기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:bg-white hover:text-primary"
          >
            아이디 찾기
          </button>
        </div>

        {/* 아이디, 비번 찾기 */}
        <div className="flex items-center justify-between px-3">
          <span
            onClick={() => navigateTo(routes.pwinquiry)}
            className="text-sm cursor-pointer"
          >
            비밀번호 찾기
          </span>
          <span
            onClick={() => navigateTo(routes.signin)}
            className="text-sm cursor-pointer"
          >
            로그인
          </span>
        </div>
      </div>
    </div>
  );
};

export default FindIdPage;

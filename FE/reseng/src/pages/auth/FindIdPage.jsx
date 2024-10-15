import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindIdPage = () => {
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 필터링
    const filteredValue = value.replace(/[^0-9]/g, '');
    setPhone(filteredValue);
  };

  // 페이지 이동
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleFindPassword = () => {
    navigate('/pwinquiry');
  };

  const handleFindIdSuccess = () => {
    navigate('/idinquiry/success');
  };

  const handleFindIdFailure = () => {
    navigate('/idinquiry/failure');
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center pt-16">
      <div className="w-full max-w-lg p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">아이디 찾기</h1>
        <hr className="w-full border-t-2 border-[#2EA642] mb-6" />

        {/* 업체명 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="text-lg mb-2 self-start">업체명</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2 mb-1"
            placeholder="업체명을 입력해주세요"
          />
          <span className="self-start text-xs text-[#F75252]">
            가입 시 등록한 업체명을 입력해주세요.
          </span>
        </div>

        {/* 휴대폰 번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="text-lg mb-2 self-start">휴대폰 번호</label>
          <input
            type="tel"
            maxLength="11"
            value={phone}
            onChange={handlePhoneChange}
            className="border rounded-lg w-full p-2 mb-1"
            placeholder="숫자만 입력해주세요"
          />
          <span className="self-start text-xs text-[#F75252]">
            가입 시 등록한 휴대폰번호를 입력해주세요.
          </span>
        </div>

        {/* 아이디 찾기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            className="w-full bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            아이디 찾기
          </button>
        </div>

        {/* 아이디, 비번 찾기 */}
        <div className="flex items-center justify-between px-3 ">
          <span onClick={handleFindPassword} className="cursor-pointer text-sm">
            비밀번호 찾기
          </span>
          <span onClick={handleLogin} className="cursor-pointer text-sm">
            로그인
          </span>
        </div>

        {/* 임시 테스트 버튼 - 삭제 예정 */}
        <div className="flex items-center justify-between px-3 ">
          <span
            onClick={handleFindIdSuccess}
            className="cursor-pointer text-sm"
          >
            아이디 찾기 성공(테스트 용 버튼)
          </span>
          <span
            onClick={handleFindIdFailure}
            className="cursor-pointer text-sm"
          >
            아이디 찾기 실패(테스트 용 버튼)
          </span>
        </div>
      </div>
    </div>
  );
};
export default FindIdPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FindPasswordPage = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // 간단한 이메일 유효성 검사 (형식 체크)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(value));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 필터링
    const filteredValue = value.replace(/[^0-9]/g, '');
    setPhone(filteredValue);
  };

  // 페이지 이동
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleFindId = () => {
    navigate('/id');
  };

  const handleChangePassword = () => {
    navigate('/change_password');
  };

  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-lg p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">비밀번호 찾기</h1>
        <hr className="w-full border-t-2 border-[#2EA642] mb-6" />

        {/* 이메일 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="text-lg mb-2 self-start">이메일</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full border rounded-lg p-2 mb-1 ${isValid ? 'border-gray-300' : 'border-red-500'}`}
            placeholder="이메일을 입력해주세요"
          />
          {email === '' ? (
            <span className="self-start text-xs text-[#F75252]">
              가입 시 등록한 이메일을 입력해주세요.
            </span>
          ) : (
            !isValid && (
              <span className="self-start text-xs text-[#F75252]">
                유효한 이메일 주소를 입력해주세요.
              </span>
            )
          )}
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

        {/* 비밀번호 찾기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            className="w-full bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 아이디 찾기, 로그인 버튼 */}
        <div className="flex items-center justify-between px-3 ">
          <span onClick={handleFindId} className="cursor-pointer text-sm">
            아이디 찾기
          </span>
          <span onClick={handleLogin} className="cursor-pointer text-sm">
            로그인
          </span>
        </div>

        {/* 임시 - 나중에 지울 부분 */}
        <div className="flex items-center justify-between px-3 ">
          <span
            onClick={handleChangePassword}
            className="cursor-pointer text-sm"
          >
            임시 확인 새로운 비밀번호 확인 페이지(삭제할 버튼)
          </span>
        </div>
      </div>
    </div>
  );
};
export default FindPasswordPage;

import React, { useState } from 'react';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const FindPasswordPage = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-lg p-8">
        <h1 className="pt-16 mb-6 text-2xl font-bold">비밀번호 찾기</h1>
        <hr className="w-full mb-6 border-t-2 border-primary" />

        {/* 이메일 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">이메일</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full p-2 mb-1 border rounded-lg ${isValid ? 'border-gray3' : 'border-warning'}`}
            placeholder="이메일을 입력해주세요"
          />
          {email === '' ? (
            <span className="self-start text-xs text-warning">
              가입 시 등록한 이메일을 입력해주세요.
            </span>
          ) : (
            !isValid && (
              <span className="self-start text-xs text-warning">
                유효한 이메일 주소를 입력해주세요.
              </span>
            )
          )}
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

        {/* 비밀번호 찾기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:bg-white hover:text-primary"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 아이디 찾기, 로그인 버튼 */}
        <div className="flex items-center justify-between px-3">
          <span
            onClick={() => navigateTo(routes.idinquiry)}
            className="text-sm cursor-pointer"
          >
            아이디 찾기
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

export default FindPasswordPage;

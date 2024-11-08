import React, { useState } from 'react';

const PasswordInfoForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 비밀번호 일치 여부
  const isPasswordMatched =
    password && confirmPassword && password === confirmPassword;

  return (
    <>
      {/* 비밀번호 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-1 text-lg">비밀번호</label>
        <span className="self-start mb-2 text-xs text-gray3">
          영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-1 border rounded-lg"
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-1 border rounded-lg"
          placeholder="비밀번호를 한 번 더 입력해주세요"
        />
        {/* 비밀번호 일치 여부에 따른 메시지 표시 */}
        {!isPasswordMatched && confirmPassword && (
          <span className="self-start text-xs text-warning">
            비밀번호가 일치하지 않습니다.
          </span>
        )}
      </div>
    </>
  );
};

export default PasswordInfoForm;

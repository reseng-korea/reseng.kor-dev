import React, { useState, useEffect } from 'react';

import {
  validatePassword,
  checkPasswordMatch,
} from '../../../utils/PasswordValidation';

const PasswordInfoForm = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isValidPassword,
  setIsValidPassword,
  isPasswordMatched,
  setIsPasswordMatched,
}) => {
  // 비밀번호 유효성 검사
  // const validatePassword = (password) => {
  //   const passwordRegex =
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  //   return passwordRegex.test(password);
  // };
  // // 비밀번호 일치 여부
  // const checkPasswordMatch = (password, confirmPassword) => {
  //   return password && confirmPassword && password === confirmPassword;
  // };

  const handlePasswordInputChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleConfirmPasswordInputChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
  };

  useEffect(() => {
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validatePassword(confirmPassword);
    const doesPasswordMatch = checkPasswordMatch(password, confirmPassword);
    setIsValidPassword(isPasswordValid && isConfirmPasswordValid);
    setIsPasswordMatched(doesPasswordMatch);
  }, [password, confirmPassword]);

  return (
    <>
      {/* 비밀번호 */}
      <div className="flex flex-col items-center px-3 py-2">
        <div className="flex self-start space-x-1">
          <label className="mb-2 text-lg">비밀번호</label>
          <span className="text-warning font-bold text-lg">*</span>
        </div>
        <span className="self-start mb-2 text-xs text-gray3">
          영문, 숫자, 특수문자를 포함한 8자 이상, 16자 이하의 비밀번호를
          입력해주세요.
        </span>
        <input
          type="password"
          value={password}
          onChange={handlePasswordInputChange}
          className="w-full p-2 mb-1 border rounded-lg"
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col items-center px-3 py-2">
        <div className="flex self-start space-x-1">
          <label className="mb-2 text-lg">비밀번호 확인</label>
          <span className="text-warning font-bold text-lg">*</span>
        </div>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordInputChange}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-2xl p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">비밀번호 변경</h1>
        <p className="text-xs mb-2">
          임시 비밀번호로 로그인되었습니다.
          <br />
          안전한 계정 사용을 위해 새로운 비밀번호를 설정해주세요.
        </p>
        <hr className="w-full border-t-2 border-[#2EA642] mb-6" />

        {/* 임시 비밀번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="text-lg mb-2 self-start">임시 비밀번호</label>
          <input
            type="password"
            className={`w-full border rounded-lg p-2 mb-1`}
            placeholder="임시 비밀번호를 입력해주세요"
          />
        </div>

        {/* 새로운 비밀번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="text-lg mb-1 self-start">새로운 비밀번호</label>
          <span className="self-start text-xs text-gray-500 mb-2">
            영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
          </span>
          <input
            type="password"
            className={`w-full border rounded-lg p-2 mb-1`}
            placeholder="새로운 비밀번호를 입력해주세요"
          />
        </div>

        {/* 새로운 비밀번호 확인 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="text-lg mb-2 self-start">
            새로운 비밀번호 확인
          </label>
          <input
            type="password"
            className={`w-full border rounded-lg p-2 mb-1`}
            placeholder="새로운 비밀번호를 한 번 더 입력해주세요"
          />
          <span className="self-start text-xs text-[#F75252]">
            비밀번호가 일치하지 않습니다.
          </span>
        </div>

        {/* 비밀번호 변경하기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            className="w-full bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            비밀번호 변경하기
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChangePasswordPage;

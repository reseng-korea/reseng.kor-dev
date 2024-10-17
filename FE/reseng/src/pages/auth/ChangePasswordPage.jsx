import React, { useState } from 'react';

const ChangePasswordPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-md">
        <h1 className="pt-16 mb-6 text-2xl font-bold">비밀번호 변경</h1>
        <p className="mb-2 text-xs">
          임시 비밀번호로 로그인되었습니다.
          <br />
          안전한 계정 사용을 위해 새로운 비밀번호를 설정해주세요.
        </p>
        <hr className="w-full mb-6 border-t-2 border-primary" />

        {/* 임시 비밀번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">임시 비밀번호</label>
          <input
            type="password"
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="임시 비밀번호를 입력해주세요"
          />
        </div>

        {/* 새로운 비밀번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-1 text-lg">새로운 비밀번호</label>
          <span className="self-start mb-2 text-xs text-gray3">
            영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
          </span>
          <input
            type="password"
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="새로운 비밀번호를 입력해주세요"
          />
        </div>

        {/* 새로운 비밀번호 확인 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">
            새로운 비밀번호 확인
          </label>
          <input
            type="password"
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="새로운 비밀번호를 한 번 더 입력해주세요"
          />
          <span className="self-start text-xs text-warning">
            비밀번호가 일치하지 않습니다.
          </span>
        </div>

        {/* 비밀번호 변경하기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:bg-white hover:text-primary"
          >
            비밀번호 변경하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import login from './../../assets/login.png';
import kakao from './../../assets/kakao_logo.png';
import google from './../../assets/google_logo.png';

import { IoIosMail, IoIosLock } from 'react-icons/io';

const LoginPage = () => {
  // 사용자 입력 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 페이지 이동
  const navigate = useNavigate();

  const handleFindPassword = () => {
    navigate('/password');
  };

  const handleFindId = () => {
    navigate('/id');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리 로직 (API 요청 등)
    console.log('로그인 정보:', { email, password });
  };

  return (
    <div className="flex h-screen">
      {/* 왼쪽 : 이미지 */}
      <div
        className="w-5/12 bg-cover bg-center relative move-right"
        style={{ backgroundImage: `url(${login})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-xs sm:text-sm md:text-xl lg:text-3xl font-bold text-left">
            안녕하세요 :) <br />
            지구를 위한 한 걸음, 우리 함께해요!
          </h1>
        </div>
      </div>

      {/* 오른쪽 : 로그인 폼 */}
      <div className="w-7/12 flex flex-col items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <div className="text-2xl font-bold text-center mb-6">로그인</div>
          <form>
            {/* 이메일 */}
            <div className="flex items-center px-3 py-2">
              <IoIosMail className="text-[#2EA642] text-3xl mr-3" />
              <div className="flex w-full items-center border rounded-lg px-3 py-2">
                <input
                  type="email"
                  className="w-full outline-none text-xs sm:text-sm md:text-sm lg:text-base"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
            </div>
            {/* 비밀번호 */}
            <div className="flex items-center px-3 py-2">
              <IoIosLock className="text-[#2EA642] text-3xl mr-3" />
              <div className="flex w-full items-center border rounded-lg px-3 py-2">
                <input
                  type="password"
                  className="w-full outline-none text-[11px] sm:text-sm md:text-sm lg:text-base"
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>
            </div>
            {/* 로그인 상태 유지 */}
            <div className="flex items-center mb-2 px-3 py-2">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label
                htmlFor="rememberMe"
                className="text-gray-700 text-xs sm:text-sm md:text-sm lg:text-base"
              >
                로그인 상태 유지
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full mb-2 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
            >
              로그인
            </button>

            {/* 비번, 아이디 찾기, 회원가입 */}
            <div className="mb-4 flex items-center justify-between px-3 py-2">
              <span
                onClick={handleFindPassword}
                className="text-[8px] sm:text-xs md:text-sm lg:text-sm cursor-pointer"
              >
                비밀번호 찾기
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm">
                |
              </span>
              <span
                onClick={handleFindId}
                className="text-[8px] sm:text-xs md:text-sm lg:text-sm cursor-pointer"
              >
                아이디 찾기
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm">
                |
              </span>
              <span
                onClick={handleSignUp}
                className="text-[8px] sm:text-xs md:text-sm lg:text-sm cursor-pointer"
              >
                회원가입
              </span>
            </div>

            {/* 간편 로그인 */}
            <div className="flex items-center px-3 py-2">
              <hr className="w-full border-t border-black my-4" />
              <span className="w-full text-[8px] sm:text-xs md:text-sm lg:text-sm">
                간편 로그인
              </span>
              <hr className="w-full border-t border-black my-4" />
            </div>

            <div className="mb-4 flex items-center justify-center">
              <img
                src={kakao}
                alt="카카오"
                className="object-cover w-12 h-12 mx-4"
              />
              <img
                src={google}
                alt="구글"
                className="object-cover w-12 h-12 mx-4"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

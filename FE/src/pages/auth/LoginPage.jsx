import React, { useState } from 'react';

import login from './../../assets/login.png';
import kakao from './../../assets/kakao_logo.png';
import google from './../../assets/google_logo.png';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import { IoIosMail, IoIosLock } from 'react-icons/io';

const LoginPage = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  // 사용자 입력 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 처리 로직 (API 요청 등)
    console.log('로그인 정보:', { email, password });
  };

  return (
    <div className="flex min-h-screen">
      {/* 왼쪽 : 이미지 */}
      <div
        className="relative w-5/12 bg-cover bg-center move-right"
        style={{ backgroundImage: `url(${login})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-xs font-bold text-left text-white sm:text-sm md:text-xl lg:text-3xl">
            안녕하세요 :) <br />
            지구를 위한 한 걸음, 우리 함께해요!
          </h1>
        </div>
      </div>

      {/* 오른쪽 : 로그인 폼 */}
      <div className="flex flex-col items-center justify-center w-7/12 bg-white">
        <div className="w-full max-w-md p-8">
          <div className="mb-6 text-2xl font-bold text-center">로그인</div>
          <form>
            {/* 이메일 */}
            <div className="flex items-center px-3 py-2">
              <IoIosMail className="mr-3 text-3xl text-primary" />
              <div className="flex items-center w-full px-3 py-2 border rounded-lg">
                <input
                  type="email"
                  className="w-full text-xs outline-none sm:text-sm md:text-sm lg:text-base"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex items-center px-3 py-2">
              <IoIosLock className="mr-3 text-3xl text-primary" />
              <div className="flex items-center w-full px-3 py-2 border rounded-lg">
                <input
                  type="password"
                  className="w-full text-[11px] outline-none sm:text-sm md:text-sm lg:text-base"
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>
            </div>

            {/* 로그인 상태 유지 */}
            <div className="flex items-center px-3 py-2 mb-2">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label
                htmlFor="rememberMe"
                className="text-xs text-gray-700 sm:text-sm md:text-sm lg:text-base"
              >
                로그인 상태 유지
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:bg-white hover:text-primary"
            >
              로그인
            </button>

            {/* 비번, 아이디 찾기, 회원가입 */}
            <div className="flex items-center justify-between px-3 py-2 mt-2 mb-4">
              <span
                onClick={() => navigateTo(routes.pwinquiry)}
                className="text-[8px] cursor-pointer sm:text-xs md:text-sm lg:text-sm"
              >
                비밀번호 찾기
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm">
                |
              </span>
              <span
                onClick={() => navigateTo(routes.idinquiry)}
                className="text-[8px] cursor-pointer sm:text-xs md:text-sm lg:text-sm"
              >
                아이디 찾기
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm">
                |
              </span>
              <span
                onClick={() => navigateTo(routes.signup)}
                className="text-[8px] cursor-pointer sm:text-xs md:text-sm lg:text-sm"
              >
                회원가입
              </span>
            </div>

            {/* 간편 로그인 */}
            <div className="flex items-center px-3 py-2">
              <hr className="w-full my-4 border-t border-gray3" />
              <span className="w-full text-[8px] text-gray3 sm:text-xs md:text-sm lg:text-sm">
                간편 로그인
              </span>
              <hr className="w-full my-4 border-t border-gray3" />
            </div>

            <div className="flex items-center justify-center mb-4">
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

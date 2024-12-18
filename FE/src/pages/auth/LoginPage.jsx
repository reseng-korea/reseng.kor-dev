import React, { useState } from 'react';
import axios from 'axios';

import useModal from '../../hooks/useModal';

import login from './../../assets/login.png';
import kakao from './../../assets/kakao_logo.png';
import google from './../../assets/google_logo.png';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import { handleLogin } from '../../services/auth/authService';

import { IoIosMail, IoIosLock } from 'react-icons/io';

const LoginPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const url = import.meta.env.VITE_API_BASE_URL_LOCAL;

  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  // 사용자 입력 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const ENVIRONMENT = window.location.origin.includes('localhost')
    ? 'local'
    : 'production';
  const oauthUrl = `${apiUrl}/oauth2/authorization/google?frontend=${ENVIRONMENT}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setModalOpen(true);
      openModal({
        primaryText: '아이디를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!password) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/login`,
          {
            email: email,
            password: password,
            isAuto: rememberLogin,
          },
          {
            withCredentials: true, // 쿠키 포함
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // console.log(response);

        // localStorage.setItem('accessToken', response.headers.authorization);
        // localStorage.setItem('userId', response.data.id);
        // localStorage.setItem('role', response.data.role);
        // localStorage.setItem('name', response.data.representativeName);
        handleLogin(response.data, response.headers.authorization);

        // 임시 비밀번호인지 판단 여부
        if (response.data.temporaryPasswordStatus) {
          navigateTo(routes.pwinquiryNew);
        } else {
          navigateTo(routes.home);
          window.location.reload();
        }
      } catch (error) {
        const code = error.response?.data?.code;
        // console.log(error);
        if (code == 4024) {
          setModalOpen(true);
          openModal({
            primaryText: '계정이 비활성화되었습니다.',
            context: '관리자에게 문의하세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        } else if (code == 4012) {
          setModalOpen(true);
          openModal({
            primaryText: '해당 정보로 등록된 회원이 없습니다.',
            context: '아이디와 비밀번호를 다시 확인해 주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        } else {
          setModalOpen(true);
          openModal({
            primaryText: '입력하신 정보가 유효하지 않습니다.',
            context: '올바른 아이디와 비밀번호를 입력해주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        }
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberLogin = (e) => {
    setRememberLogin(e.target.checked);
  };

  // const handleKaKao = async () => {
  //   window.location.href = `${apiUrl}/oauth2/authorization/kakao`;
  // };

  // const handleKaKao = async () => {
  //   try {
  //     // 백엔드에 Kakao 로그인 URL 요청
  //     const response = await axios.post(`${apiUrl}/oauth2/authorization/kakao`);

  //     console.log(response);

  //     // 백엔드에서 Kakao 로그인 URL을 반환하면, 해당 URL로 리다이렉트
  //     window.location.href = response.data.kakaoLoginUrl;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleKaKaoLogin = () => {
  //   const kakaoLoginUrl = `${apiUrl}/oauth2/authorization/kakao`;
  //   window.location.href = kakaoLoginUrl;
  // };

  // const handleGoogle = async () => {

  // };

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
                  value={email}
                  onChange={handleEmailChange}
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
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full text-[11px] outline-none sm:text-sm md:text-sm lg:text-base"
                  placeholder="비밀번호를 입력해주세요"
                />
              </div>
            </div>

            {/* 로그인 상태 유지 */}
            <div className="flex items-center px-3 py-2 mb-2">
              <input
                onChange={handleRememberLogin}
                type="checkbox"
                id="rememberLogin"
                className="mr-2"
              />
              <label
                htmlFor="rememberLogin"
                className="text-xs text-gray-700 sm:text-sm md:text-sm lg:text-base"
              >
                로그인 상태 유지
              </label>
            </div>

            {/* 로그인 버튼 */}
            <div className="px-3">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full px-3 py-2 font-bold text-white bg-primary rounded-lg hover:bg-hover"
              >
                로그인
              </button>
            </div>
            {/* 비번, 아이디 찾기, 회원가입 */}
            <div className="flex items-center justify-between px-3 py-2 mt-2 mb-4">
              <span
                onClick={() => navigateTo(routes.pwinquiry)}
                className="text-[8px] cursor-pointer sm:text-xs md:text-sm lg:text-sm hover:text-gray3"
              >
                비밀번호 찾기
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm">
                |
              </span>
              <span
                onClick={() => navigateTo(routes.idinquiry)}
                className="text-[8px] cursor-pointer sm:text-xs md:text-sm lg:text-sm hover:text-gray3"
              >
                아이디 찾기
              </span>
              <span className="text-[8px] sm:text-xs md:text-sm lg:text-sm">
                |
              </span>
              <span
                onClick={() => navigateTo(routes.termsAndPolicyNonSocial)}
                className="text-[8px] cursor-pointer sm:text-xs md:text-sm lg:text-sm hover:text-gray3"
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
              {/* <a href={`${apiUrl}/oauth2/authorization/kakao`}> */}
              <a
                href={`${apiUrl}/oauth2/authorization/kakao?frontend=${ENVIRONMENT}`}
              >
                <img
                  src={kakao}
                  alt="카카오"
                  className="object-cover w-12 h-12 mx-4"
                />
              </a>
              {/* <a href={`${apiUrl}/oauth2/authorization/google`}> */}
              <a
                href={`${apiUrl}/oauth2/authorization/google?frontend=${ENVIRONMENT}`}
              >
                <img
                  src={google}
                  alt="구글"
                  className="object-cover w-12 h-12 mx-4"
                />
              </a>
            </div>
          </form>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </div>
  );
};

export default LoginPage;

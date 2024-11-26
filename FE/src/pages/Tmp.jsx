// 임시페이지임 삭제 예정
import React, { useState, useEffect, useRef } from 'react';
import { useNavigateTo } from '../hooks/useNavigateTo';
import axios from 'axios';
import useModal from '../hooks/useModal';

const Tmp = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();
  const { openModal, closeModal, RenderModal } = useModal();

  const handleLogout = async () => {
    const accesstoken = localStorage.getItem('accessToken');
    console.log(accesstoken);
    const refreshToken = localStorage.getItem('refreshToken');
    console.log(refreshToken);

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/logout`,
        {},
        {
          withCredentials: true, // 쿠키를 포함하도록 설정
        }
      );

      if (response.data.code == 200) {
        openModal({
          primaryText: '로그아웃되었습니다.',
          context: '이용해 주셔서 감사합니다.',
          type: 'warning',
          isAutoClose: false,
          onConfirm: () => {
            navigateTo(routes.home);
            closeModal();
          },
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/reissue`,
        {},
        { withCredentials: true }
      );
      console.log('리프레시 토큰 재발급', response);
      localStorage.setItem('accessToken', response.headers.authorization);

      localStorage.setItem('액세스 재발급', '재발급');

      // loginTime = Date.now(); // 갱신된 시점 저장
    } catch (error) {
      console.error('토큰 만료', error);
      // 실패 시 로그아웃 처리
      // logoutService();
    }
  };

  return (
    <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
      <div className="w-full flex flex-col mb-1 space-x-2">
        <button onClick={() => navigateTo(routes.itemsBanner)}>
          아이템 페이지
        </button>
        <button onClick={refreshAccessToken}>아이템 페이지</button>
      </div>
      <RenderModal />
    </div>
  );
};
export default Tmp;

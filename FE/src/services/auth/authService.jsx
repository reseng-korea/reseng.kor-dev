import axios from 'axios';

import { handleTokenExpiration } from '../../App';

let openModalInstance = null;

export const setOpenModal = (openModal) => {
  openModalInstance = openModal;
};

const apiUrl = import.meta.env.VITE_API_BASE_URL;

let loginTime = localStorage.getItem('loginTime')
  ? Number(localStorage.getItem('loginTime'))
  : null;

// 로그인 후 정보 저장
export const handleLogin = (data, accessToken) => {
  loginTime = Date.now(); // 로그인 시점 저장 (전역 변수로)

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('userId', data.id);
  localStorage.setItem('role', data.role);
  localStorage.setItem('name', data.representativeName);
  localStorage.setItem('loginType', data.loginType);
};

// accessToken 만료 시 access,refresh 재발급
export const refreshAccessToken = async () => {
  // console.log('토큰 만료 확인');
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/reissue`,
      {},
      { withCredentials: true }
    );

    // console.log('리프레시 토큰 재발급 가능', response);

    localStorage.setItem('accessToken', response.headers.authorization);
  } catch (error) {
    // console.error('토큰 만료로 재발급 불가능', error);
    handleTokenExpiration(openModalInstance);
  }
};

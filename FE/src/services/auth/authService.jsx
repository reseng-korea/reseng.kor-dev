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
  document.cookie = `accessToken=${accessToken}; path=/; HttpOnly; Secure`;
};
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/users/me`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
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

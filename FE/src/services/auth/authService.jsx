import axios from 'axios';
import { GiConsoleController } from 'react-icons/gi';

import { logoutService } from './logoutService';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

let loginTime = localStorage.getItem('loginTime')
  ? Number(localStorage.getItem('loginTime'))
  : null;
const expiresIn = 3600 * 1000; // 1시간 (accessToken 유효 시간)

// 로그인 후 정보 저장
export const handleLogin = (data, accessToken) => {
  loginTime = Date.now(); // 로그인 시점 저장 (전역 변수로)

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('userId', data.id);
  localStorage.setItem('role', data.role);
  localStorage.setItem('name', data.representativeName);
  localStorage.setItem('time', new Date(loginTime).toLocaleString());
};

// export const isTokenExpiring = () => {
//   console.log(loginTime);
//   if (!loginTime) return false; // 로그인 전에는 항상 false
//   const elapsedTime = Date.now() - loginTime;
//   console.log(elapsedTime);
//   return elapsedTime >= expiresIn - 10 * 60 * 1000; // 만료 10분 전 체크 //60,000
// };

// accessToken 만료 시 access,refresh 재발급
export const refreshAccessToken = async () => {
  console.log('토큰 만료 확인');
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/reissue`,
      {},
      { withCredentials: true }
    );

    console.log('리프레시 토큰 재발급 가능', response);

    localStorage.setItem('accessToken', response.headers.authorization);
    loginTime = Date.now();
    localStorage.setItem('time', new Date(loginTime).toLocaleString());
  } catch (error) {
    console.error('토큰 만료로 재발급 불가능', error);
    // refresh 만료 모달
  }
};

// export const refreshAccessToken = async (handleTokenExpiration) => {
//   console.log('토큰 만료 확인');
//   try {
//     const response = await axios.post(
//       `${apiUrl}/api/v1/reissue`,
//       {},
//       { withCredentials: true }
//     );

//     console.log('리프레시 토큰 재발급', response);

//     localStorage.setItem('accessToken', response.headers.authorization);
//     loginTime = Date.now();
//     localStorage.setItem('loginTime', loginTime);
//     localStorage.setItem('time', new Date(loginTime).toLocaleString());
//     localStorage.setItem('액세스 재발급', '재발급');
//   } catch (error) {
//     console.error('토큰 만료', error);

//     if (handleTokenExpiration) {
//       handleTokenExpiration();
//     }
//   }
// };

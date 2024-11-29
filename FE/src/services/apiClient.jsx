import axios from 'axios';
import { refreshAccessToken } from './auth/authService';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

let openModalInstance = null;

export const setOpenModal = (openModal) => {
  openModalInstance = openModal;
};

const apiClient = axios.create({
  baseURL: apiUrl,
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('요청 인터셉터 실행');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;
    console.log('응답 인터셉터 실행');

    // 토큰 만료 에러(401) 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재요청 방지 플래그
      try {
        console.log('여기 실행');
        await refreshAccessToken(); // 토큰 재발급 요청
        const newAccessToken = localStorage.getItem('accessToken'); //새로운 토큰을
        originalRequest.headers.Authorization = newAccessToken;

        return apiClient(originalRequest); // 원래 요청으로 다시 보내기
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        // handleTokenExpiration(openModalInstance);
        // return Promise.reject(refreshError); // 토큰 재발급 실패 에러 전파
      }
    }

    // 다른 에러는 그대로 전파
    return Promise.reject(error);
  }
);

export default apiClient;

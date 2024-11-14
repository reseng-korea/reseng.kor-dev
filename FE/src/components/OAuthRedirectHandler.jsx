import { useEffect } from 'react';
import axios from 'axios';

import { useNavigateTo } from '../hooks/useNavigateTo';

function OAuthRedirectHandler() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();

  console.log('여기에 들어오낭');

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        // 로그인 상태를 확인하는 API 호출 (쿠키 기반 인증)
        const response = await axios.post(
          `${apiUrl}/api/v1/oauth2-jwt-header`,
          {
            withCredentials: true,
            // headers: {
            //   Refresh: 'your-refresh-token', // 쿠키에서 자동으로 포함
            // }, // 쿠키 포함
          }
        );

        // 로그인 성공 시 대시보드로 리디렉트
        if (response.status === 200) {
          // navigate('/dashboard');
        }
      } catch (error) {
        console.error('로그인 확인 실패:', error);
        // 로그인 실패 시 홈 페이지로 리디렉트
        // navigate('/');
      }
    }

    // 로그인 상태 확인
    checkLoginStatus();
  }, [navigateTo]);

  return <div>로그인 처리 중...</div>;
}

export default OAuthRedirectHandler;

import { useEffect } from 'react';
import axios from 'axios';

import { useNavigateTo } from '../hooks/useNavigateTo';
import { handleLogin } from '../services/auth/authService';

function OAuthRedirectHandler() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        // 로그인 상태를 확인하는 API 호출 (쿠키 기반 인증)

        const response = await fetch(`${apiUrl}/api/v1/oauth2-jwt-header`, {
          method: 'POST',
          credentials: 'include', // 쿠키를 포함하도록 설정
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // JSON 응답 처리
        const data = await response.json(); // 안전하게 호출
        // 응답 헤더에서 토큰 추출
        const accessToken = response.headers.get('authorization');

        if (accessToken) {
          // localStorage.setItem('userId', data.id);
          // localStorage.setItem('role', data.role);
          // localStorage.setItem('loginType', data.loginType);

          handleLogin(data, accessToken);

          if (data.role === 'ROLE_PENDING') {
            navigateTo(routes.termsAndPolicySocial, { data });
          } else {
            navigateTo(routes.home);
            window.location.reload();
          }
        } else {
          console.error('Tokens are missing in the response headers.');
          navigateTo(routes.home);
        }
      } catch (error) {
        console.error(error);
      }
    }

    // 로그인 상태 확인
    checkLoginStatus();
  }, [navigateTo]);

  return <div>로그인 처리 중...</div>;
}

export default OAuthRedirectHandler;

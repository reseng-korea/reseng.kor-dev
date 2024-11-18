import { useEffect } from 'react';
import axios from 'axios';

import { useNavigateTo } from '../hooks/useNavigateTo';

function OAuthRedirectHandler() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();

  console.log('route가 성공적으로 되어 OAuthRedirectHandler로 들어옵니다요');

  useEffect(() => {
    async function checkLoginStatus() {
      console.log('useEffect로 들어옵니당');
      try {
        // 로그인 상태를 확인하는 API 호출 (쿠키 기반 인증)

        const response = await fetch(`${apiUrl}/api/v1/oauth2-jwt-header`, {
          method: 'POST',
          credentials: 'include', // 쿠키를 포함하도록 설정
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);

        // const responseText = await response.text();
        // console.log('응답 데이터 (텍스트):', responseText);

        // JSON 응답 처리
        const data = await response.json(); // 안전하게 호출
        console.log('데이터:', data);

        // 응답 헤더에서 토큰 추출
        const accessToken = response.headers.get('authorization'); // accessToken
        const refreshToken = response.headers.get('refresh'); // refreshToken

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        if (accessToken && refreshToken) {
          // 로컬 스토리지에 저장
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          console.log('이거 뭔데', response.statusText);

          if (!data.companyName) {
            navigateTo(routes.socialinfo, {
              data,
            });
          } else {
            navigateTo(routes.home);
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

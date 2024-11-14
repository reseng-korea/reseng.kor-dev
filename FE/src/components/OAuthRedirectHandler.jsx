import { useEffect } from 'react';
import axios from 'axios';

function OAuthRedirectHandler() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    async function fetchToken() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      console.log(code);

      if (code) {
        try {
          const response = await axios.post(
            `${apiUrl}/oauth2/authorization/kakao`,
            { code }
          );

          console.log(response);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('인증 코드 없음.');
      }
    }
    console.log('여기 들어오는건가 ??');

    fetchToken();
  }, []);

  return <div>로그인 처리 중...</div>;
}

export default OAuthRedirectHandler;

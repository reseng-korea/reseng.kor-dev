import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const ValidateQR = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [searchParams] = useSearchParams();
  const { navigateTo, routes } = useNavigateTo();

  useEffect(() => {
    const validateQR = async () => {
      const uuid = searchParams.get('uuid'); // URL에서 uuid 추출

      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/qr-code?uuid=${uuid}`
        );
        // const data = await response.json();
        console.log(response);

        // if (response.ok) {
        //   navigateTo(routes.qrSuccess); // 성공 시 성공 페이지로 이동
        // } else {
        //   navigateTo(routes.qrFailure); // 실패 시 실패 페이지로 이동
        // }
      } catch (error) {
        console.error('QR 코드 유효성 검사 중 오류:', error);
        // navigate('/failure'); // 오류 발생 시 실패 페이지로 이동
      }
    };

    validateQR();
  }, [searchParams, navigateTo]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>QR 코드 유효성을 확인 중입니다...</p>
    </div>
  );
};

export default ValidateQR;

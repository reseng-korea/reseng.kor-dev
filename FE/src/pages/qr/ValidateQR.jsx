import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import apiClient from '../../services/apiClient';

const ValidateQR = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [searchParams] = useSearchParams();
  const { navigateTo, routes } = useNavigateTo();

  useEffect(() => {
    const validateQR = async () => {
      const uuid = searchParams.get('uuid'); // URL에서 uuid 추출

      try {
        const response = await apiClient.get(
          `${apiUrl}/api/v1/qr-code?uuid=${uuid}`
        );
        // const data = await response.json();
        console.log(response);

        const data = response.data;

        navigateTo(routes.qrSuccess, {
          clientName: data.clientName,
          company: data.company,
          postedDate: data.postedDate,
          postedLocation: data.postedLocation,
          requestedDate: data.requestedDate,
          requestedLength: data.requestedLength,
          typeWidth: data.typeWidth,
        });
      } catch (error) {
        console.error('QR 코드 유효성 검사 중 오류:', error);
        navigateTo(routes.qrFailure);
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

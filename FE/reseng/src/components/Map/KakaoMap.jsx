import React, { useEffect, useState } from 'react';

const KakaoMap = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false); // 로딩 상태를 관리하는 state

  useEffect(() => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);
          setIsMapLoaded(true); // 지도 로딩 완료 후 상태 업데이트
        });
      };
      document.head.appendChild(script);
    } else {
      // API가 이미 로드된 경우
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      new window.kakao.maps.Map(container, options);
      setIsMapLoaded(true); // 이미 로드된 경우에도 상태 업데이트
    }

    return () => {
      const scriptElement = document.querySelector(
        'script[src^="//dapi.kakao.com"]'
      );
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {!isMapLoaded && (
        <div className="flex justify-center items-center h-full">
          <div className="loader">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;

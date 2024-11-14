import React, { useEffect, useState, useRef } from 'react';
import marker3 from '../../assets/marker_manager.png';
import marker4 from '../../assets/marker_distributor.png';

const KakaoMap = ({ company, selectedCompany }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // Kakao Maps API를 로드하고 맵을 초기화
  useEffect(() => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          initializeMap();
          setIsMapLoaded(true);
        });
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
      setIsMapLoaded(true);
    }

    return () => {
      const scriptElement = document.querySelector(
        'script[src^="//dapi.kakao.com"]'
      );
      if (scriptElement) document.head.removeChild(scriptElement);
    };
  }, []);

  // 맵 초기화 함수
  const initializeMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(35.8703223603616, 128.584274193938),
      level: 2, // 기본 줌 레벨
    };
    mapRef.current = new window.kakao.maps.Map(container, options);
  };

  // 버튼 클릭에 따라 카테고리를 설정하고 마커 업데이트
  const handleAllClick = () => setSelectedCategory('전체');
  const handleHeadquartersClick = () => setSelectedCategory('본사');
  const handleDistributorClick = () => setSelectedCategory('총판');

  // selectedCategory가 변경될 때마다 필터링된 마커를 생성
  const updateMarkers = () => {
    if (!mapRef.current) return;

    // 기존 마커를 모두 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const imageSize = new window.kakao.maps.Size(70, 76);

    const filteredLocations = company.filter((location) =>
      selectedCategory === '전체'
        ? true
        : (location.role === 'ROLE_MANAGER' && selectedCategory === '본사') ||
          (location.role === 'ROLE_DISTRIBUTOR' && selectedCategory === '총판')
    );

    filteredLocations.forEach((location) => {
      const markerPosition = new window.kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );
      const imageSrc = location.role === 'ROLE_MANAGER' ? marker3 : marker4;
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize
      );

      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position: markerPosition,
        image: markerImage,
      });

      const content = `
        <div style="
          padding: 25px; 
          font-size: 12px;
          width: 200px;
          max-width: 200px;
          border-radius: 8px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          background-color: white;
          white-space: normal;
        ">
          <div style="font-weight: bold; margin-bottom: 4px;">${location.companyName}</div>
          <div>${location.city} ${location.streetAddress} ${location.detailAddress}</div>
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: content,
        yAnchor: 1.7,
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        customOverlay.setMap(mapRef.current);
      });
      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        customOverlay.setMap(null);
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    if (isMapLoaded) {
      updateMarkers();
    }
  }, [selectedCategory, company, isMapLoaded]);

  // 특정 업체 선택 시 지도를 해당 위치로 이동
  useEffect(() => {
    if (selectedCompany && mapRef.current) {
      setSelectedCategory('전체');
      const position = new window.kakao.maps.LatLng(
        selectedCompany.latitude,
        selectedCompany.longitude
      );
      mapRef.current.setCenter(position);
      mapRef.current.setLevel(2);
    }
  }, [selectedCompany]);

  return (
    <div className="relative w-full h-full">
      <div className="flex absolute top-3 left-3 z-10 p-2 space-x-2">
        <div
          className={`flex justify-center items-center space-x-1 border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-gray3 ${
            selectedCategory === '전체' ? 'bg-placeHolder' : 'bg-white'
          }`}
          onClick={() => {
            handleAllClick();
            setSelectedCategory('전체');
          }}
        >
          <span>전체</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-1 border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-gray3 ${
            selectedCategory === '본사' ? 'bg-placeHolder' : 'bg-white'
          }`}
          onClick={() => {
            handleHeadquartersClick();
            setSelectedCategory('본사');
          }}
        >
          <img src={marker3} className="w-7 h-7" alt="본사 마커" />
          <span>본사</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-1 border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-gray3 ${
            selectedCategory === '총판' ? 'bg-placeHolder' : 'bg-white'
          }`}
          onClick={() => {
            handleDistributorClick();
            setSelectedCategory('총판');
          }}
        >
          <img src={marker4} className="w-7 h-7" alt="총판 마커" />
          <span>총판</span>
        </div>
      </div>
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
    </div>
  );
};

export default KakaoMap;

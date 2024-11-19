import React, { useEffect, useState, useRef } from 'react';
import marker3 from '../../assets/marker_manager.png';
import marker4 from '../../assets/marker_distributor.png';

const KakaoMap = ({ company, selectedCompany, setSelectedCompany }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const initializeMap = () => {
    const container = document.getElementById('map');
    if (!container) {
      console.error('#map container not found');
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(35.8703223603616, 128.584274193938),
      level: 4,
    };
    mapRef.current = new window.kakao.maps.Map(container, options);
  };

  useEffect(() => {
    const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        initializeMap();
        setIsMapLoaded(true);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
        setIsMapLoaded(true);
      });
    };
    document.head.appendChild(script);

    return () => {
      const scriptElement = document.querySelector(
        'script[src^="//dapi.kakao.com"]'
      );
      if (scriptElement) document.head.removeChild(scriptElement);
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded) {
      updateMarkers();

      // 선택된 회사가 있는 경우 지도 중심 이동
      if (selectedCompany) {
        const adjustedPosition = new window.kakao.maps.LatLng(
          selectedCompany.latitude - 0.002, // 약간 위로 보정
          selectedCompany.longitude
        );
        mapRef.current.panTo(adjustedPosition); // 지도 부드럽게 이동
        mapRef.current.setLevel(2); // 줌 레벨 설정
      }
    }
  }, [selectedCategory, selectedCompany, company, isMapLoaded]);

  const updateMarkers = () => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const imageSize = new window.kakao.maps.Size(70, 76);

    const filteredLocations = selectedCompany
      ? [selectedCompany]
      : company.filter((location) =>
          selectedCategory === '전체'
            ? true
            : selectedCategory === '본사'
              ? location.role === 'ROLE_MANAGER'
              : selectedCategory === '총판'
                ? location.role === 'ROLE_DISTRIBUTOR' ||
                  location.role === 'ROLE_AGENCY'
                : false
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCompany(null); // 회사 선택 초기화
    if (mapRef.current) {
      const bounds = new window.kakao.maps.LatLngBounds();
      company
        .filter((location) =>
          category === '전체'
            ? true
            : category === '본사'
              ? location.role === 'ROLE_MANAGER'
              : category === '총판'
                ? location.role === 'ROLE_DISTRIBUTOR' ||
                  location.role === 'ROLE_AGENCY'
                : false
        )
        .forEach((location) => {
          const position = new window.kakao.maps.LatLng(
            location.latitude,
            location.longitude
          );
          bounds.extend(position);
        });
      mapRef.current.setBounds(bounds);
    }
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company); // 회사 선택 업데이트
    setSelectedCategory('전체'); // 카테고리를 "전체"로 설정
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex absolute top-3 left-3 z-10 p-2 space-x-2">
        <div
          className={`flex justify-center items-center space-x-1 border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-gray3 ${
            selectedCategory === '전체' ? 'bg-placeHolder' : 'bg-white'
          }`}
          onClick={() => handleCategorySelect('전체')}
        >
          <span>전체</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-1 border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-gray3 ${
            selectedCategory === '본사' ? 'bg-placeHolder' : 'bg-white'
          }`}
          onClick={() => handleCategorySelect('본사')}
        >
          <img src={marker3} className="w-7 h-7" alt="본사 마커" />
          <span>본사</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-1 border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-gray3 ${
            selectedCategory === '총판' ? 'bg-placeHolder' : 'bg-white'
          }`}
          onClick={() => handleCategorySelect('총판')}
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

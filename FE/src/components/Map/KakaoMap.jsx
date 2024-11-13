import React, { useEffect, useState, useRef } from 'react';
import { tmplocationdata } from '../../data/tmplocationdata';
// import marker3 from '../../assets/marker_3.png';
// import marker4 from '../../assets/marker_4.png';
import marker3 from '../../assets/marker_manager.png';
import marker4 from '../../assets/marker_distributor.png';

const KakaoMap = ({ company, selectedCompany }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const mapRef = useRef(null);
  const selectedMarkerRef = useRef(null);
  const markersRef = useRef([]);

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
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCategory === '본사') {
      const headquarters = company.find(
        (location) => location.role === 'ROLE_MANAGER'
      );
      if (headquarters && mapRef.current) {
        const headquartersPosition = new window.kakao.maps.LatLng(
          headquarters.latitude,
          headquarters.longitude
        );
        mapRef.current.setCenter(headquartersPosition);
        mapRef.current.setLevel(3);
      }
    } else if (selectedCategory === '총판') {
      const koreaCenter = new window.kakao.maps.LatLng(36.5, 127.5);
      if (mapRef.current) {
        mapRef.current.setCenter(koreaCenter);
        mapRef.current.setLevel(13);
      }
    }
  }, [selectedCategory, company]);

  const initializeMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(35.8703223603616, 128.584274193938),
      level: 2, // 전체 보기 기본 레벨
    };
    const newMap = new window.kakao.maps.Map(container, options);
    mapRef.current = newMap;
  };

  const handleAllClick = () => {
    setSelectedCategory('전체');

    if (mapRef.current) {
      const koreaCenter = new window.kakao.maps.LatLng(36.5, 127.5);

      // 지도 크기 재조정
      // mapRef.current.relayout();

      // 한국 중심과 확대 수준 설정
      mapRef.current.setCenter(koreaCenter);
      mapRef.current.setLevel(13); // 전국이 한 화면에 보이도록 적절한 확대 수준

      // 모든 마커 업데이트
      updateMarkers();
    }
  };

  const updateMarkers = () => {
    if (!mapRef.current) return;

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
  }, [selectedCategory, isMapLoaded]);

  // 본사 클릭 시 지도 중심과 확대 레벨 설정
  const handleHeadquartersClick = () => {
    setSelectedCategory('본사');

    const headquarters = company.find(
      (location) => location.role === 'ROLE_MANAGER'
    );
    if (headquarters && mapRef.current) {
      const headquartersPosition = new window.kakao.maps.LatLng(
        headquarters.latitude,
        headquarters.longitude
      );
      mapRef.current.setCenter(headquartersPosition);
      mapRef.current.setLevel(3); // 줌 인하여 본사 중심 보기
    }
  };

  // 총판 클릭 시 전체 지도 보기로 설정
  // 총판의 전체 위치를 볼 수 있도록.
  const handleDistributorClick = () => {
    setSelectedCategory('총판');

    if (mapRef.current) {
      const koreaCenter = new window.kakao.maps.LatLng(36.5, 127.5);
      // mapRef.current.relayout();
      mapRef.current.setCenter(koreaCenter);
      mapRef.current.setLevel(13);
    }
  };

  useEffect(() => {
    if (selectedCompany && mapRef.current) {
      const position = new window.kakao.maps.LatLng(
        selectedCompany.latitude,
        selectedCompany.longitude
      );
      mapRef.current.setCenter(position);
    }
  }, [selectedCompany]);

  return (
    <div className="relative w-full h-full">
      <div className="flex absolute top-3 left-3 z-10 p-2 space-x-2">
        <div
          className={`flex justify-center items-center space-x-1 bg-white border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-primary ${
            selectedCategory === '전체' ? 'bg-[#F3F3F3]' : ''
          }`}
          onClick={handleAllClick}
        >
          <span>전체</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-1 bg-white border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-primary ${
            selectedCategory === '본사' ? 'bg-[#F3F3F3]' : ''
          }`}
          onClick={handleHeadquartersClick}
        >
          <img src={marker3} className="w-7 h-7" />
          <span>본사</span>
        </div>
        <div
          className={`flex justify-center items-center space-x-1 bg-white border border-gray2 rounded-2xl shadow-lg px-4 py-2 cursor-pointer hover:border-primary ${
            selectedCategory === '총판' ? 'bg-[#F3F3F3]' : ''
          }`}
          onClick={handleDistributorClick}
        >
          <img src={marker4} className="w-7 h-7" />
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

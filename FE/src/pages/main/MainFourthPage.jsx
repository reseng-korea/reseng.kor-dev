import React, { useRef, useState, useEffect } from 'react';

// 이미지 import
import main4 from './../../assets/main4.png';
import main44 from './../../assets/main44_1.png';

import Layout from '../../components/Layouts';
import SliderMainFourthPage from './SliderMainFourthPage';

const MainFourthPage = () => {
  const h2Ref = useRef(null); // h2 요소 참조
  const [isZoomed, setIsZoomed] = useState(false); // 배경 확대 상태
  const [isAnimated, setIsAnimated] = useState(false); // 애니메이션 상태

  // 스크롤 감지하여 배경 이미지 애니메이션 트리거
  const handleScroll = () => {
    if (h2Ref.current) {
      const h2Top = h2Ref.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // h2가 화면에 보일 때 배경 애니메이션 실행 (확대 -> 축소)
      if (h2Top < windowHeight && h2Top > 0) {
        setIsAnimated(true);
        setIsZoomed(true); // zoom-active 클래스 적용
      } else {
        setIsAnimated(false);
        setIsZoomed(false); // 초기 확대 상태로 복귀
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); // 스크롤 이벤트 해제
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray3">
      <div
        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center image-zoom transition-transform duration-1000 ${
          isZoomed ? 'zoom-active' : ''
        }`}
        style={{ backgroundImage: `url(${main44})` }}
      ></div>

      {/* <Layout> */}
      <div className="relative flex w-full h-full gap-x-8 justify-between items-center px-24">
        {/* A 단락 */}
        <div className="flex-3 flex flex-col p-0 text-white text-xl h-full z-10 justify-center ">
          <h2
            className={`font-bold text-3xl sm:text-lg md:text-2xl lg:text-5xl mb-12 ${isAnimated ? 'move-right' : ''}`}
            ref={h2Ref}
            style={{ lineHeight: '1.5', textAlign: 'left' }}
          >
            <span style={{ color: '#2EA642' }}>환경 보호</span>를 위한 한 걸음
            <br />
            <span style={{ color: '#2EA642' }}>친환경 현수막</span>으로
            함께하세요!
          </h2>
          <p className={`text-left ${isAnimated ? 'move-right' : ''}`}>
            생분해성 소재로 제작되어 행사 후에도 환경에 부담을 주지 않으며,
            <br />
            재활용이 가능한 특성 덕분에 지속 가능한 이벤트에 최적의
            솔루션입니다.
          </p>
        </div>
        {/* B 단락 - 캐러셀 */}
        <SliderMainFourthPage />
      </div>
      {/* </Layout> */}
    </div>
  );
};

export default MainFourthPage;

import React, { useRef, useState, useEffect } from 'react';

// 이미지 import
import main4 from '../assets/main4.png';
import main44 from '../assets/main44_1.png';

import Layout from '../components/Layouts';

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
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center image-zoom transition-transform duration-1000 ${
          isZoomed ? 'zoom-active' : ''
        }`}
        style={{ backgroundImage: `url(${main44})` }}
      ></div>

      <Layout>
        <div className="relative flex w-full h-full gap-x-8 justify-between items-center">
          {/* A 단락 */}
          <div className="flex-3 flex flex-col justify-start items-start p-0 text-white text-xl h-full z-10">
            <div className="w-full" style={{ marginBottom: 'auto' }}>
              <h2
                className={`font-bold text-3xl sm:text-lg md:text-2xl lg:text-5xl mb-12 ${isAnimated ? 'move-right' : ''}`}
                ref={h2Ref}
                style={{ lineHeight: '1.5', textAlign: 'left' }}
              >
                <span style={{ color: '#2EA642' }}>환경 보호</span>를 위한 한
                걸음
                <br />
                <span style={{ color: '#2EA642' }}>친환경 현수막</span>으로
                함께하세요!
              </h2>
            </div>

            <div
              className="w-full flex items-center"
              style={{ height: '100%' }}
            >
              <p className={`text-left ${isAnimated ? 'move-right' : ''}`}>
                생분해성 소재로 제작되어 행사 후에도 환경에 부담을 주지 않으며,
                <br />
                재활용이 가능한 특성 덕분에 지속 가능한 이벤트에 최적의
                솔루션입니다.
              </p>
            </div>
          </div>

          {/* B 단락 */}
          <div
            className={`flex-2 flex justify-end items-center h-auto md:h-96 lg:h-screen z-10 ${isAnimated ? 'slide-down' : ''}`}
          >
            <div className="grid grid-cols-2 w-full">
              <div className="w-full aspect-square bg-transparent flex justify-center items-center p-6 text-white text-3xl font-bold">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>

              <div className="w-full aspect-square bg-transparent border border-white hover:border-[#2EA642] flex justify-start items-end p-6 text-white font-bold text-sm sm:text-lg md:text-xl lg:text-3xl relative">
                환경 보호
                <button className="absolute top-4 right-4 border border-white text-white text-lg hidden md:block md:text-sm lg:text-lg py-2 px-4 bg-transparent hover:bg-[#2EA642] hover:text-white hover:border-none transition duration-300">
                  더보기
                </button>
              </div>

              <div className="w-full aspect-square bg-transparent border border-white hover:border-[#2EA642] flex justify-start items-end p-6 text-white font-bold text-sm sm:text-lg md:text-xl lg:text-3xl relative">
                생분해
                <button className="absolute top-4 right-4 border border-white text-white text-lg hidden md:block md:text-sm lg:text-lg py-2 px-4 bg-transparent hover:bg-[#2EA642] hover:text-white hover:border-none transition duration-300">
                  더보기
                </button>
              </div>

              <div className="w-full aspect-square bg-transparent border-b border-r border-white hover:border-[#2EA642] hover:border-2 flex justify-start items-end p-6 text-white font-bold text-sm sm:text-lg md:text-xl lg:text-3xl relative">
                지속 가능
                <button className="absolute top-4 right-4 border border-white text-white text-lg hidden md:block md:text-sm lg:text-lg py-2 px-4 bg-transparent hover:bg-[#2EA642] hover:text-white hover:border-none transition duration-300">
                  더보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default MainFourthPage;

import React, { useRef, useState, useEffect } from 'react';

// 이미지
import reseng from './../../assets/reandseng.png';
import cycle from './../../assets/cycle.png';
import Layout from '../../components/Layouts';

const MainSecondPage = () => {
  const secondPageRef = useRef(null);
  const [showSecondPage, setShowSecondPage] = useState(false);

  // 스크롤 애니메이션 핸들러
  const handleScroll = () => {
    if (
      secondPageRef.current &&
      secondPageRef.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowSecondPage(true);
    }
  };

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Layout>
      <div
        className={`flex flex-col justify-start items-center mt-16 w-full h-full ${
          showSecondPage ? 'slide-up' : ''
        }`}
        ref={secondPageRef}
      >
        <div className="flex justify-center items-center">
          <img src={reseng} alt="리앤생" className="w-1/6 h-auto" />
          <span className="text-black sm:text-xs md:text-2xl lg:text-2xl font-bold text-center ml-4">
            의 플라스틱 사용의 폐쇄형 순환 구조
          </span>
        </div>
        <img
          src={cycle}
          alt="순환 구조"
          className="mt-16 mb-16 w-full h-auto px-16"
        />
      </div>
    </Layout>
  );
};

export default MainSecondPage;

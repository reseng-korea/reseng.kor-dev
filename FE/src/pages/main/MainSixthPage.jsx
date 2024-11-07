import React, { useEffect, useState, useRef } from 'react';

const MainSixthPage = () => {
  const [isFixed, setIsFixed] = useState(false);
  const spanRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        // span이 화면 중앙에 도달하면 고정
        if (containerTop <= screenHeight / 2) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      }
    };

    // Intersection Observer를 사용하여 MainSixthPage가 화면을 벗어날 때 고정 해제
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsFixed(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[4800px] overflow-hidden bg-gray1"
    >
      <div className="absolute inset-x-0 top-0 h-screen text-center bg-gray3 z-10">
        <span
          ref={spanRef}
          className={`${
            isFixed
              ? 'fixed top-1/2 transform -translate-y-1/2'
              : 'absolute top-1/2 transform -translate-y-1/2'
          } inset-x-0 text-6xl font-bold transition-all duration-500`}
        >
          지속 가능한 내일을 위해, 오늘부터 시작합니다.
        </span>
      </div>
    </div>
  );
};

export default MainSixthPage;

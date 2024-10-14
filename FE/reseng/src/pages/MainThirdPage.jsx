import React, { useRef, useState, useEffect } from 'react';

// 이미지
import main3_1 from '../assets/main3_1.png';
import main3_2 from '../assets/main3_2.png';
import main3_3 from '../assets/main3_3.png';
import main333 from '../assets/main3_333.png';

const MainThirdPage = () => {
  const thirdElement1Ref = useRef(null);
  const thirdElement2Ref = useRef(null);
  const thirdElement3Ref = useRef(null);
  const [showThirdElement1, setShowThirdElement1] = useState(false);
  const [showThirdElement2, setShowThirdElement2] = useState(false);
  const [showThirdElement3, setShowThirdElement3] = useState(false);

  const handleScroll = () => {
    // 세 번째 페이지 요소별 감지
    if (
      thirdElement1Ref.current &&
      thirdElement1Ref.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowThirdElement1(true);
    }
    if (
      thirdElement2Ref.current &&
      thirdElement2Ref.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowThirdElement2(true);
    }
    if (
      thirdElement3Ref.current &&
      thirdElement3Ref.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowThirdElement3(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full bg-cover bg-center`}
      style={{ backgroundImage: `url(${main333})` }}
    >
      <div className="flex justify-around w-full px-8 mt-20">
        {/* A 영역 */}
        <div className="flex flex-col items-center">
          <img
            src={main3_1}
            alt="친환경 현수막"
            className={`w-5/6 h-auto ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement1Ref}
          />
          <span
            className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement2Ref}
          >
            친환경 현수막
          </span>
          <span
            className={`mt-6 text-white text-center text-lg ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
          >
            (주)휴비스의
            <br />
            생분해 원사 ecoen을
            <br />
            사용한 현수막
          </span>
        </div>

        {/* B 영역 */}
        <div className="flex flex-col items-center">
          <img
            src={main3_2}
            alt="생분해 제품"
            className={`w-5/6 h-auto ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement1Ref}
          />
          <span
            className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement2Ref}
          >
            생분해 제품
          </span>
          <span
            className={`mt-6 text-white text-center text-lg ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
          >
            (주)휴비스의
            <br />
            생분해 원사 ecoen을
            <br />
            사용한 제품
          </span>
        </div>

        {/* C 영역 */}
        <div className="flex flex-col items-center">
          <img
            src={main3_3}
            alt="현수막 자원화"
            className={`w-5/6 h-auto ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement1Ref}
          />
          <span
            className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement3Ref}
          >
            현수막 자원화
          </span>
          <span
            className={`mt-6 text-white text-center text-lg ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
          >
            폐현수막을 자원화한
            <br />
            원사로 태어난 제품
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainThirdPage;

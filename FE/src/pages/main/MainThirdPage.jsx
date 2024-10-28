import React, { useRef, useState, useEffect } from 'react';

// 이미지
import main3_1 from './../../assets/main3_1.png';
import main3_2 from './../../assets/main3_2.png';
import main3_3 from './../../assets/main3_3.png';
import main333 from './../../assets/main3_333.png';

const MainThirdPage = () => {
  const thirdElement1Ref = useRef(null);
  const thirdElement2Ref = useRef(null);
  const thirdElement3Ref = useRef(null);
  const [showThirdElement1, setShowThirdElement1] = useState(false);
  const [showThirdElement2, setShowThirdElement2] = useState(false);
  const [showThirdElement3, setShowThirdElement3] = useState(false);

  const handleScroll = () => {
    // 첫 번째 요소가 화면에 나타나면 애니메이션 시작
    if (
      thirdElement1Ref.current &&
      thirdElement1Ref.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowThirdElement1(true);

      // 첫 번째 요소가 나타난 후 500ms 뒤에 두 번째 요소 실행
      setTimeout(() => {
        setShowThirdElement2(true);
      }, 500); // 500ms (0.5초 딜레이)

      // 두 번째 요소가 나타난 후 500ms 뒤에 세 번째 요소 실행
      setTimeout(() => {
        setShowThirdElement3(true);
      }, 1000); // 총 1000ms (1초 딜레이)
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
            className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`}
          >
            친환경 현수막
          </span>
          <span
            className={`mt-6 text-white text-center text-lg ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`}
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
            className={`w-5/6 h-auto ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement2Ref}
          />
          <span
            className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}
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
            className={`w-5/6 h-auto ${showThirdElement3 ? 'slide-up' : 'opacity-0'}`}
            ref={thirdElement3Ref}
          />
          <span
            className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement3 ? 'slide-up' : 'opacity-0'}`}
          >
            현수막 자원화
          </span>
          <span
            className={`mt-6 text-white text-center text-lg ${showThirdElement3 ? 'slide-up' : 'opacity-0'}`}
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

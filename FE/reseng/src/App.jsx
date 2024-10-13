import { useState, useEffect, useRef } from 'react';
import './App.css';
import Layout from './components/Layouts';
import Navbar from './components/Navbar';
// 첫번째 메인 페이지 사진
import main1_1 from './assets/main1_1.png';
import main1_2 from './assets/main1_2.png';
import main1_3 from './assets/main1_3.png';
import main1_4 from './assets/main1_4.png';
// 두번째 메인 페이지 사진
import reseng from './assets/reandseng.png';
import cycle from './assets/cycle.png';
// 세번째 메인 페이지 사진
import main3_1 from './assets/main3_1.png';
import main3_2 from './assets/main3_2.png';
import main3_3 from './assets/main3_3.png';
import main33 from './assets/main33.png';
import main333 from './assets/main3_333.png';


function App() {
  const [showTexts, setShowTexts] = useState([false, false, false, false]);
  const firstPageRef = useRef(null);
  const secondPageRef = useRef(null);
  const thirdPageRef = useRef(null);
  const [showFirstPage, setShowFirstPage] = useState(false);
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [showThirdPage, setShowThirdPage] = useState(false);
  
  // 세 번째 페이지 요소 각각의 가시성을 위한 상태
  const [showThirdElement1, setShowThirdElement1] = useState(false);
  const [showThirdElement2, setShowThirdElement2] = useState(false);
  const [showThirdElement3, setShowThirdElement3] = useState(false);

  useEffect(() => {
    const timers = [];
    for (let i = 0; i < showTexts.length; i++) {
      timers.push(setTimeout(() => {
        setShowTexts((prev) => {
          const newShowTexts = [...prev];
          newShowTexts[i] = true; // i번째 텍스트만 true로 설정
          return newShowTexts;
        });
      }, i * 500));
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer)); // 클린업
    };
  }, []);

  useEffect(() => {
    if (showThirdPage) {
      const timers = [
        setTimeout(() => setShowThirdElement1(true), 0),
        setTimeout(() => setShowThirdElement2(true), 500), // 0.5초 후
        setTimeout(() => setShowThirdElement3(true), 1000) // 1초 후
      ];
  
      return () => {
        timers.forEach(timer => clearTimeout(timer)); // 클린업
      };
    }
  }, [showThirdPage]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (firstPageRef.current && firstPageRef.current.getBoundingClientRect().top < window.innerHeight) {
      setShowFirstPage(true);
    }
    if (secondPageRef.current && secondPageRef.current.getBoundingClientRect().top < window.innerHeight) {
      setShowSecondPage(true);
    }
    if (thirdPageRef.current && thirdPageRef.current.getBoundingClientRect().top < window.innerHeight) {
      setTimeout(() => {
        setShowThirdPage(true);
      }, 500); // 1초 뒤에 애니메이션 실행
    }
  };

  // 컴포넌트가 마운트될 때 스크롤 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Navbar />

      <div className="h-screen">

        {/* 첫번째 메인 페이지 */}
        <div className="flex justify-between items-center w-full h-full" ref={firstPageRef}>
          {showTexts.map((showText, index) => (
            <div className="relative w-1/4 h-full" key={index}>
              <img src={[main1_1, main1_2, main1_3, main1_4][index]} alt={`이미지 ${index + 1}`} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 flex justify-center items-center ${showText ? 'fade-in' : 'opacity-0'}`}>
                <span className="text-white sm:text-xs md:text-2xl lg:text-2xl font-bold">
                  {['국내산 폐 PET 병이', '현수막으로', '현수막이', '다시 자원으로..'][index]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 두번째 메인 페이지 */}
        <Layout>
          <div className={`flex flex-col justify-start items-center mt-16 w-full h-full ${showSecondPage ? 'slide-up' : ''}`} ref={secondPageRef}>
            <div className="flex justify-center items-center">
              <img src={reseng} alt="리앤생" className="w-1/6 h-auto" />
              <span className="text-black sm:text-xs md:text-2xl lg:text-2xl font-bold text-center ml-4">
                의 플라스틱 사용의 폐쇄형 순환 구조
              </span>
            </div>
            <img src={cycle} alt="순환 구조" className="mt-16 mb-16 w-full h-auto px-16" />
          </div>
        </Layout>

        {/* 세번째 메인 페이지 */}
        <div className={`flex flex-col justify-center items-center w-full h-full bg-cover bg-center`} style={{ backgroundImage: `url(${main333})` }} ref={thirdPageRef}>
          {/* <span className={`text-white text-center text-3xl font-bold mt-28 mb-8 ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`}>친환경 아이템</span> */}
          <div className="flex justify-around w-full px-8 mt-20">
            {/* A 영역 */}
            <div className={`flex flex-col items-center`}>
              <img src={main3_1} alt="친환경 현수막" className={`w-5/6 h-auto ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`} />
              <span className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}>친환경 현수막</span>
              <span className={`mt-6 text-white text-center text-lg ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}>(주)휴비스의<br />생분해 원사 ecoen을<br />사용한 현수막</span>
            </div>

            {/* B 영역 */}
            <div className={`flex flex-col items-center`}>
              <img src={main3_2} alt="생분해 제품" className={`w-5/6 h-auto ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`} />
              <span className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}>생분해 제품</span>
              <span className={`mt-6 text-white text-center text-lg ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}>(주)휴비스의<br />생분해 원사 ecoen을<br />사용한 제품</span>
            </div>

            {/* C 영역 */}
            <div className={`flex flex-col items-center`}>
              <img src={main3_3} alt="현수막 자원화" className={`w-5/6 h-auto ${showThirdElement1 ? 'slide-up' : 'opacity-0'}`} />
              <span className={`mt-10 text-white text-center text-2xl font-bold ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}>현수막 자원화</span>
              <span className={`mt-6 text-white text-center text-lg ${showThirdElement2 ? 'slide-up' : 'opacity-0'}`}>폐현수막을 자원화한<br />원사로 태어난 제품</span>
            </div>
          </div>
        </div>
      </div>  
    </>
  );
}

export default App;

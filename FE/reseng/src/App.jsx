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
import main333 from './assets/main3_333.png';

function App() {
  const [showTexts, setShowTexts] = useState([false, false, false, false]);
  const firstPageRef = useRef(null);
  const secondPageRef = useRef(null);
  const thirdElement1Ref = useRef(null);
  const thirdElement2Ref = useRef(null);
  const thirdElement3Ref = useRef(null);
  const [showFirstPage, setShowFirstPage] = useState(false);
  const [showSecondPage, setShowSecondPage] = useState(false);
  const [showThirdElement1, setShowThirdElement1] = useState(false);
  const [showThirdElement2, setShowThirdElement2] = useState(false);
  const [showThirdElement3, setShowThirdElement3] = useState(false);

  useEffect(() => {
    const timers = [];
    for (let i = 0; i < showTexts.length; i++) {
      timers.push(
        setTimeout(() => {
          setShowTexts((prev) => {
            const newShowTexts = [...prev];
            newShowTexts[i] = true; // i번째 텍스트만 true로 설정
            return newShowTexts;
          });
        }, i * 500)
      );
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer)); // 클린업
    };
  }, []);

  const handleScroll = () => {
    // 첫 번째 페이지 감지
    if (
      firstPageRef.current &&
      firstPageRef.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowFirstPage(true);
    }
    // 두 번째 페이지 감지
    if (
      secondPageRef.current &&
      secondPageRef.current.getBoundingClientRect().top < window.innerHeight
    ) {
      setShowSecondPage(true);
    }
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
    <>
      <Navbar />

      <div className="h-screen">
        {/* 첫번째 메인 페이지 */}
        <div
          className="flex justify-between items-center w-full h-full"
          ref={firstPageRef}
        >
          {showTexts.map((showText, index) => (
            <div className="relative w-1/4 h-full" key={index}>
              <img
                src={[main1_1, main1_2, main1_3, main1_4][index]}
                alt={`이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 flex justify-center items-center ${showText ? 'fade-in' : 'opacity-0'}`}
              >
                <span className="text-white sm:text-xs md:text-2xl lg:text-2xl font-bold">
                  {
                    [
                      '국내산 폐 PET 병이',
                      '현수막으로',
                      '현수막이',
                      '다시 자원으로..',
                    ][index]
                  }
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 두번째 메인 페이지 */}
        <Layout>
          <div
            className={`flex flex-col justify-start items-center mt-16 w-full h-full ${showSecondPage ? 'slide-up' : ''}`}
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

        {/* 세번째 메인 페이지 */}
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
      </div>
    </>
  );
}

export default App;

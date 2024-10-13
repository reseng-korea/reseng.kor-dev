import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
// 첫번째 메인 페이지 사진
import main1 from './assets/main1.png';
import main2 from './assets/main2.png';
import main3 from './assets/main3.png';
import main4 from './assets/main4.png';

function App() {
  const [showTexts, setShowTexts] = useState([false, false, false, false]);

  useEffect(() => {
    // 각 텍스트에 대해 순차적으로 애니메이션 실행
    const timers = [];
    for (let i = 0; i < showTexts.length; i++) {
      timers.push(setTimeout(() => {
        setShowTexts((prev) => {
          const newShowTexts = [...prev];
          newShowTexts[i] = true; // i번째 텍스트만 true로 설정
          return newShowTexts;
        });
      }, i * 500)); // 각 텍스트에 대해 300ms 간격으로 딜레이 추가
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer)); // 클린업
    };
  }, []);

  return (
    <>
      {/* 네비게이션 바 */}
      <Navbar />

      {/* 첫번째 메인 페이지 */}
      <div className="flex justify-between items-center w-full">
        {showTexts.map((showText, index) => (
          <div className="relative w-1/4" key={index}>
            <img src={[main1, main2, main3, main4][index]} alt={`이미지 ${index + 1}`} className="w-full h-auto" />
            <div className={`absolute inset-0 flex justify-center items-center ${showText ? 'fade-in' : 'opacity-0'}`}>
              <span className="text-white sm:text-xs md:text-2xl lg:text-2xl font-bold">
                {['국내산 폐 PET 병이', '현수막으로', '현수막이', '다시 자원으로..'][index]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

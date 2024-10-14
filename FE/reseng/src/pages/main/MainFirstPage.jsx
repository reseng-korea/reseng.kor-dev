import React, { useRef, useState, useEffect } from 'react';

// 이미지
import main1_1 from './../../assets/main1_1.png';
import main1_2 from './../../assets/main1_2.png';
import main1_3 from './../../assets/main1_3.png';
import main1_4 from './../../assets/main1_4.png';

const MainFirstPage = () => {
  const [showTexts, setShowTexts] = useState([false, false, false, false]);
  const firstPageRef = useRef(null);

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

  return (
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
  );
};

export default MainFirstPage;

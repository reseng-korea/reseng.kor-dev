import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ecoever from './../../assets/ecoeverLM.jpg';
import ecoen from './../../assets/ecoen.jpg';

const SliderMainFourthPage = () => {
  const settings = {
    dots: true, // 하단 네비게이션 점
    infinite: true, // 무한 반복
    speed: 500, // 전환 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1, // 한 번에 넘어가는 슬라이드 수
    autoplay: true, // 자동 재생
    autoplaySpeed: 3000, // 자동 재생 속도 (ms)
  };

  return (
    <div className="slider-wrapper w-1/3 h-auto px-8 py-16 bg-white bg-opacity-20 rounded-lg">
      <Slider {...settings}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-full h-56 flex justify-center items-center">
            <img src={ecoen} className="w-auto h-24 rounded-lg" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              ecoen
            </span>
            <span className="text-white text-md">
            2024년 "차세대 일류상품"으로 선정된 소재로 만든 현수막
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-full h-56 flex justify-center items-center">
            <img src={ecoever} className="w-auto h-24 rounded-lg" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              LMF
            </span>
            <span className="text-white text-md">
              2024년 "세계 일류상품"으로 선정된 소재의 원료로 폐현수막을 사용
            </span>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default SliderMainFourthPage;

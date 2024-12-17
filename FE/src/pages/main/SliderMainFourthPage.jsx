import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import tmp from './../../assets/login.png';
import tmp2 from './../../assets/main1_2.png';
import tmp3 from './../../assets/main1_3.png';

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
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={tmp} className="w-full h-56 object-cover rounded-lg" />
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              제목1
            </span>
            <span className="text-white text-md">
              내용내용내용내용내용내용내용내용내용내용내용내용
              내용내용내용내용내용내용내용내용내용내용내용내
            </span>
          </div>
        </div>
        <div>
          <img src={tmp2} className="w-full h-56 rounded-lg" />
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              제목2
            </span>
            <span className="text-white text-md">
              내용내용내용내용내용내용내용내용내용내용내용내용
            </span>
          </div>
        </div>
        <div>
          <img src={tmp3} className="w-full h-56 rounded-lg" />
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              제목3
            </span>
            <span className="text-white text-md">
              내용내용내용내용내용내용내용내용내용내용내용내용
            </span>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default SliderMainFourthPage;

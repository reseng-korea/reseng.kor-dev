import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import gimhae from './../../assets/gimhae.png';

const SliderMainFourthPage = () => {
  const settings = {
    dots: true, // 하단 네비게이션 점
    infinite: true, // 무한 반복
    speed: 500, // 전환 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 수
    slidesToScroll: 1, // 한 번에 넘어가는 슬라이드 수
    autoplay: true, // 자동 재생
    autoplaySpeed: 10000, // 자동 재생 속도 (ms)
  };

  return (
    <div className="slider-wrapper w-1/3 h-auto px-8 py-16 bg-black bg-opacity-50 rounded-lg pt-8 pb-10">
      <div className="text-white text-2xl font-bold mb-8">함께하는 단체</div>
      <Slider {...settings}>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={gimhae} className="h-56 object-cover rounded-lg mx-auto"/>
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              김해시
            </span>
            <span className="text-white text-md">
              김해시 "친환경 현수막 자원순환 시스템 구축"으로
            </span>
            <span className="text-white text-md">
              [제13회 대한민국 지식대상] 대통령상 수상
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={gimhae} className="h-56 object-cover rounded-lg mx-auto"/>
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              김해시
            </span>
            <span className="text-white text-md">
              김해시 "친환경 현수막 자원순환 시스템 구축"으로
            </span>
            <span className="text-white text-md">
              [제13회 대한민국 지식대상] 대통령상 수상1
            </span>
          </div>
        </div>
        {/* <div className="flex flex-col items-center justify-center w-full h-full">
          <img src={gimhae} className="h-56 object-cover rounded-lg mx-auto"/>
          <div className="flex flex-col">
            <span className="text-white text-xl font-bold mt-4 mb-4">
              김해시
            </span>
            <span className="text-white text-md">
              김해시 "친환경 현수막 자원순환 시스템 구축"으로
            </span>
            <span className="text-white text-md">
              [제13회 대한민국 지식대상] 대통령상 수상
            </span>
          </div>
        </div> */}
      </Slider>
    </div>
  );
};

export default SliderMainFourthPage;

import Layout from '../../components/Layouts';
import { useNavigate } from 'react-router-dom';
import { timelineData } from '../data/timelinedata';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const History = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
        <div className="w-full flex flex-col mb-1 space-x-2">
          {/* 하위 카테고리 */}
          <div className="text-3xl font-bold mb-6">회사 소개</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.company)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">회사 소개</span>
            </button>
            <button
              onClick={() => navigateTo(routes.history)}
              className="w-30 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none"
            >
              <span className="text-[#2EA642] font-bold">연혁</span>
            </button>
            <button
              onClick={() => navigateTo(routes.location)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">오시는 길</span>
            </button>
          </div>
          <hr className="w-full border-t border-[#999999] mb-12" />

          {/* 메인 */}
          <span className="text-[#2EA642] text-lg sm:text-lg md:text-xl lg:text-3xl font-bold fade-in mb-12">
            지속 가능한 세상을 위한 작은 발걸음,
            <br />
            리앤생의 친환경 여정입니다.
          </span>

          <div className="relative flex flex-col w-full">
            {/* 전체 타임라인 세로선 */}
            <div className="absolute left-[29.1%] top-0 w-0.5 h-full bg-[#2EA642] fade-in-delay"></div>

            {timelineData.map((item, index) => (
              <div key={index} className="flex w-full mb-6 relative">
                {/* A 구역 - Year */}
                <div className="w-1/4 p-4 flex justify-end fade-in-delay2">
                  <p className="text-sm md:text-xl lg:text-3xl text-black font-extrabold">
                    {item.year}
                  </p>
                </div>

                {/* B 구역 - 타임라인 구역 */}
                <div className="w-1/12 flex justify-center p-6 relative fade-in-delay">
                  {/* 원 아이콘 */}
                  <div className="hidden sm:block sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white border-2 border-[#2EA642] rounded-full"></div>
                </div>

                {/* C 구역 - Month, Description */}
                <div className="w-7/12 p-4 mb-6 fade-in-delay2">
                  {item.events.map((event, idx) => (
                    <div key={idx} className="flex mb-2">
                      {/* Month */}
                      <div className="text-[10px] sm:text-sm md:text-lg lg:text-xl font-bold text-[#2EA642] w-12">
                        {event.month}
                      </div>
                      {/* Description */}
                      <div className="text-left text-[10px] sm:text-sm md:text-lg lg:text-xl text-gray-800 ml-4">
                        {event.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;

import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import { timelineData } from '../../data/timelinedata';

const History = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          {/* 하위 카테고리 */}
          <div className="mt-16 mb-6 text-3xl font-bold">회사 소개</div>
          <div className="flex justify-center">
            <button
              onClick={() => navigateTo(routes.company)}
              className="flex items-center justify-center w-30 h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">회사 소개</span>
            </button>
            <button
              onClick={() => navigateTo(routes.history)}
              className="flex items-center justify-center w-30 h-10 border-0 border-b-2 border-[#2EA642] rounded-none bg-transition"
            >
              <span className="font-bold text-[#2EA642]">연혁</span>
            </button>
            <button
              onClick={() => navigateTo(routes.location)}
              className="flex items-center justify-center w-30 h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">오시는 길</span>
            </button>
          </div>
          <hr className="w-full mb-12 border-t border-gray1" />

          {/* 메인 */}
          <span className="mb-12 text-lg font-bold text-primary sm:text-lg md:text-xl lg:text-3xl fade-in">
            지속 가능한 세상을 위한 작은 발걸음,
            <br />
            리앤생의 친환경 여정입니다.
          </span>

          <div className="relative flex flex-col w-full">
            {/* 전체 타임라인 세로선 */}
            <div className="absolute top-0 left-[29.1%] w-0.5 h-full bg-primary fade-in-delay"></div>

            {timelineData.map((item, index) => (
              <div key={index} className="relative flex w-full mb-6">
                {/* A 구역 - 년도 */}
                <div className="flex justify-end w-1/4 p-4 fade-in-delay2">
                  <p className="text-sm font-extrabold text-black md:text-xl lg:text-3xl">
                    {item.year}
                  </p>
                </div>

                {/* B 구역 - 타임라인 구역 */}
                <div className="relative flex justify-center w-1/12 p-6 fade-in-delay">
                  {/* 원 아이콘 */}
                  <div className="hidden w-3 h-3 bg-white border-2 border-primary rounded-full sm:block sm:w-3 sm:h-3 md:w-4 md:h-4"></div>
                </div>

                {/* C 구역 - 월, 내용 */}
                <div className="w-7/12 p-4 mb-6 fade-in-delay2">
                  {item.events.map((event, idx) => (
                    <div key={idx} className="flex mb-2">
                      {/* 월 */}
                      <div className="w-12 text-[10px] font-bold text-primary sm:text-sm md:text-lg lg:text-xl">
                        {event.month}
                      </div>
                      {/* 내용 */}
                      <div className="ml-4 text-left text-[10px] text-black sm:text-sm md:text-lg lg:text-lg">
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

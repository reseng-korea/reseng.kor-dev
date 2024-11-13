import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import history from '../../assets/history.png';

import { timelineData } from '../../data/timelinedata';

const History = () => {
  const navItems = [
    { label: '회사 소개', route: '/company' },
    { label: '연혁', route: '/history' },
    { label: '오시는 길', route: '/location' },
  ];

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="연혁"
            mainCategory="회사 소개"
          />
          {/* 메인 */}
          <div className="flex flex-col">
            <div className="relative w-full h-80 rounded-2xl overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-2xl animate-zoom-in"
                src={history}
                alt="친환경 여정 이미지"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-center text-lg font-bold text-white sm:text-lg md:text-xl lg:text-3xl fade-in">
                  <span className="block mb-2">
                    지속 가능한 세상을 위한 발걸음,
                  </span>
                  리앤생의 친환경 여정입니다.
                </span>
              </div>
            </div>

            <div className="relative flex flex-col w-full mt-12 mb-12">
              {/* 리앤생 타임라인 세로선 */}
              <div className="absolute top-0 left-[29.1%] w-0.5 h-full bg-primary fade-in-delay"></div>

              {timelineData.reseng.map((item, index) => (
                <div key={index} className="relative flex w-full mt-3">
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
                      <div key={idx} className="flex mb-3">
                        {/* 월 */}
                        <div className="w-12 text-[10px] font-bold text-primary sm:text-sm md:text-lg lg:text-xl">
                          {event.month}
                        </div>
                        {/* 내용 */}
                        <div className="flex flex-col ml-4 text-left text-[10px] text-black sm:text-sm md:text-lg lg:text-lg">
                          {event.description.map((desc, id) => (
                            <div key={id} className="mb-2">
                              {desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative flex flex-col w-full mt-12 mb-12">
              {/* HS한솔 타임라인 세로선 */}
              <div className="absolute top-0 left-[29.1%] h-full border-l-2 border-dotted bg-primary fade-in-delay"></div>

              {timelineData.precompany.map((item, index) => (
                <div key={index} className="relative flex w-full mb-3">
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
                      <div key={idx} className="flex mb-3">
                        {/* 월 */}
                        <div className="w-12 text-[10px] font-bold text-primary sm:text-sm md:text-lg lg:text-xl">
                          {event.month}
                        </div>
                        {/* 내용 */}
                        <div className="flex flex-col ml-4 text-left text-[10px] text-black sm:text-sm md:text-lg lg:text-lg">
                          {event.description.map((desc, id) => (
                            <div key={id} className="mb-2">
                              {desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;

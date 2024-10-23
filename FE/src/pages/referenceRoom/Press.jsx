import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import tmp5 from '../../assets/tmp_5.png';
import tmp6 from '../../assets/tmp_6.png';
import tmp7 from '../../assets/tmp_7.png';

const Press = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          {/* 하위 카테고리 */}
          <div className="text-3xl font-bold mt-16 mb-6">자료실</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.certificate)}
              className="h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none"
            >
              <span className="text-black">인증서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.coa)}
              className="h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none"
            >
              <span className="text-black">성적서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.press)}
              className="h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-primary rounded-none"
            >
              <span className="text-primary font-bold">보도 자료</span>
            </button>
          </div>
          <hr className="w-full border-t border-gray1 mb-6" />
          {/* 메인 */}
          <div className="flex flex-col">
            <div className="flex flex-wrap w-full justify-center items-start">
              {/* 반복되는 이미지 카드 */}
              {[
                {
                  img: tmp5,
                  title: '리앤생, 연매출 10억 달성',
                  date: '2024.10.18',
                },
                {
                  img: tmp6,
                  title:
                    '리앤생, 한국 산업의 고객만족도(KCSI) 10년 연속 1위 달성',
                  date: '2024.10.18',
                },
                {
                  img: tmp7,
                  title:
                    '리앤생, 추석 연휴에도 동남아, 일본, 중국 3강구도 형성',
                  date: '2024.10.08',
                },
              ].map((item, index) => (
                <div
                  onClick={() => navigateTo(routes.pressDetail)}
                  key={index}
                  className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-1/4 justify-center items-center mx-8"
                >
                  <div className="flex justify-center items-center rounded-lg mt-4">
                    <img
                      className="h-full object-contain"
                      src={item.img}
                      alt={`인증서 ${index + 1}`}
                    />
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex flex-col items-start w-full px-2 mt-4">
                    <span className="text-left text-lg font-bold flex-grow">
                      {item.title}
                    </span>
                    <span className="text-sm text-gray3 mt-1">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-12">
              <button
                type="submit"
                className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
              >
                글쓰기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Press;

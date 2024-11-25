import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import tmp1 from '../../assets/tmp_1.png';
import tmp2 from '../../assets/tmp_2.png';

const Cerificate = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          <SubNavbar
            items={navItems}
            activePage="인증서"
            mainCategory="자료실"
          />
          {/* 메인 */}
          <div className="flex flex-col">
            <div className="flex flex-wrap w-full justify-center">
              {/* 카드 1 */}
              <div className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-2/7 items-center px-12 py-8 border border-gray3 rounded-lg mx-4 my-2">
                {/* 이미지 영역 */}
                <div className="flex justify-center items-center h-36">
                  <img
                    className="max-w-full max-h-full object-contain"
                    src={tmp1}
                    alt="인증서 1"
                  />
                </div>
                {/* 텍스트 영역 */}
                <div className="w-full mt-4 text-center">
                  <span className="text-lg font-bold">
                    한국 산업의 고객만족도
                  </span>
                  <span className="mt-2 block">친환경 부문 10년 연속 1위</span>
                </div>
              </div>

              {/* 카드 2 */}
              <div className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-2/7 items-center px-12 py-8 border border-gray3 rounded-lg mx-4 my-2">
                {/* 이미지 영역 */}
                <div className="flex justify-center items-center h-36">
                  <img
                    className="max-w-full max-h-full object-contain"
                    src={tmp2}
                    alt="인증서 2"
                  />
                </div>
                {/* 텍스트 영역 */}
                <div className="w-full mt-4 text-center">
                  <span className="text-lg font-bold">친환경 환경부</span>
                  <span className="mt-2 block">친환경 부문 10년 연속 1위</span>
                </div>
              </div>

              {/* 카드 3 */}
              <div className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-2/7 items-center px-12 py-8 border border-gray3 rounded-lg mx-4 my-2">
                {/* 이미지 영역 */}
                <div className="flex justify-center items-center h-36">
                  <img
                    className="max-w-full max-h-full object-contain"
                    src={tmp1}
                    alt="인증서 3"
                  />
                </div>
                {/* 텍스트 영역 */}
                <div className="w-full mt-4 text-center">
                  <span className="text-lg font-bold">
                    한국 산업의 고객만족도
                  </span>
                  <span className="mt-2 block">친환경 부문 10년 연속 1위</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-12">
              <button
                type="submit"
                onClick={() => navigateTo(routes.documentRegister)}
                className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
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

export default Cerificate;

import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import tmp3 from '../../assets/tmp_3.png';
import tmp4 from '../../assets/tmp_4.png';

const Coa = () => {
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
              className="h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-primary rounded-none"
            >
              <span className="text-primary font-bold">성적서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.press)}
              className="h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none"
            >
              <span className="text-black">보도 자료</span>
            </button>
          </div>
          <hr className="w-full border-t border-gray1 mb-6" />
          {/* 메인 */}
          <div className="flex flex-col">
            <div className="flex flex-wrap w-full justify-center">
              {/* 이미지 영역 */}
              <div className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-1/3 justify-center items-center mx-8">
                <div className="flex justify-center items-center border border-gray3 rounded-lg px-8 py-8 mt-4">
                  <img className="" src={tmp3} alt="인증서 1" />
                </div>

                {/* 텍스트 영역 */}
                <div className="w-full mt-4 text-center">
                  <span className="text-xl font-bold">
                    [HUVIS] 2023 OEKO-TEX CERTIFICATE
                  </span>
                </div>
              </div>
              {/* 이미지 영역 */}
              <div className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-1/3 justify-center items-center mx-8">
                <div className="flex justify-center items-center border border-gray3 rounded-lg px-8 py-8 mt-4">
                  <img className="" src={tmp4} alt="인증서 1" />
                </div>

                {/* 텍스트 영역 */}
                <div className="w-full mt-4 text-center">
                  <span className="text-xl font-bold">
                    [KATRI] ecocen 미세플라스틱 분석 결과
                  </span>
                </div>
              </div>
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

export default Coa;

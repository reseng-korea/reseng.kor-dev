import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import tmp3 from '../../assets/tmp_3.png';

const CoaDetail = () => {
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
            <div>
              <span className="text-2xl font-bold">
                [HUVIS] 2023 OEKO-TEX CERTIFICATE
              </span>
              <hr className="w-full mt-6 mb-6 border border-gray3" />
              <div className="flex flex-col items-center">
                <img className="w-1/3" src={tmp3} alt="인증서 1" />
                <span>[HUVIS] 2023 OEKO-TEX CERTIFICATE</span>
              </div>
            </div>
            {/* 목차 */}
            <div className="flex flex-col mt-24">
              <hr className="w-full mt-6 mb-6 border border-gray2" />
              <div className="flex space-x-12 px-4">
                <span>이전 글</span>
                <span>[KATRI] ecocen 미세플라스틱 분석 결과</span>
              </div>
              <hr className="w-full mt-6 mb-6 border border-gray2" />
              <div className="flex space-x-12 px-4">
                <span>다음 글</span>
                <span>다음 글이 없습니다.</span>
              </div>
              <hr className="w-full mt-6 mb-6 border border-gray2" />
            </div>
            {/* 목록 */}
            <div className="flex items-center justify-center mt-4 mb-12">
              <button
                onClick={() => navigateTo(routes.coa)}
                type="submit"
                className="px-8 py-2 font-bold border border-gray3 transition-colors duration-300 rounded-3xl hover:bg-white hover:text-primary"
              >
                목록
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoaDetail;

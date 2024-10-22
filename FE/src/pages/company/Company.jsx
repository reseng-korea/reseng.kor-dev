import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const Company = () => {
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
              className="flex items-center justify-center w-32 h-10 border-0 border-b-2 border-primary rounded-none bg-transition"
            >
              <span className="font-bold text-primary">회사 소개</span>
            </button>
            <button
              onClick={() => navigateTo(routes.history)}
              className="flex items-center justify-center w-32 h-10 border-0 hover:text-lg bg-transition"
            >
              <span className="text-black">연혁</span>
            </button>
            <button
              onClick={() => navigateTo(routes.location)}
              className="flex items-center justify-center w-32 h-10 border-0 hover:text-lg bg-transition"
            >
              <span className="text-black">오시는 길</span>
            </button>
          </div>
          <div className="flex justify-center">
            <hr className="w-full mb-6 border-t border-gray1" />
          </div>
          {/* 메인 */}
          {/* 회사 소개 내용 여기에 코드 작성하면 됨 */}
        </div>
      </div>
    </Layout>
  );
};

export default Company;

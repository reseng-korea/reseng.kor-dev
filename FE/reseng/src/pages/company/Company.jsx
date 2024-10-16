import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Company = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 mt-16 min-h-screen">
        <div className="flex flex-col w-full mb-1 space-x-2">
          <div className="mb-6 text-3xl font-bold">회사 소개</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.company)}
              className="flex items-center justify-center w-30 h-10 border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none bg-transition"
            >
              <span className="font-bold text-[#2EA642]">회사 소개</span>
            </button>
            <button
              onClick={() => navigateTo(routes.history)}
              className="flex items-center justify-center w-30 h-10 hover:text-lg border-none outline-none focus:outline-none bg-transition"
            >
              <span className="text-black">연혁</span>
            </button>
            <button
              onClick={() => navigateTo(routes.location)}
              className="flex items-center justify-center w-30 h-10 hover:text-lg border-none outline-none focus:outline-none bg-transition"
            >
              <span className="text-black">오시는 길</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-[#99999]" />
        </div>
      </div>
    </Layout>
  );
};

export default Company;

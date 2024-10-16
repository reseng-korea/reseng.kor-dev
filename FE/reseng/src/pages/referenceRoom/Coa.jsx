import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Coa = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
        <div className="w-full flex flex-col mb-1 space-x-2">
          <div className="text-3xl font-bold mb-6">자료실</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.certificate)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">인증서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.coa)}
              className="w-30 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none"
            >
              <span className="text-[#2EA642] font-bold">성적서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.press)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">보도 자료</span>
            </button>
          </div>
          <hr className="w-full border-t border-[#99999] mb-6" />
        </div>
      </div>
    </Layout>
  );
};

export default Coa;

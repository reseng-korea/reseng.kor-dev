import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Cerificate = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          <div className="text-3xl font-bold mt-16 mb-6">자료실</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.certificate)}
              className="h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-primary rounded-none"
            >
              <span className="text-primary font-bold">인증서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.coa)}
              className="h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none"
            >
              <span className="text-black">성적서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.press)}
              className="h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none"
            >
              <span className="text-black">보도 자료</span>
            </button>
          </div>
          <hr className="w-full border-t border-gray1 mb-6" />
        </div>
      </div>
    </Layout>
  );
};

export default Cerificate;

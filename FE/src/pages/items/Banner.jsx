import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const Banner = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <div className="mt-16 mb-6 text-3xl font-bold">아이템</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.itemsBanner)}
              className="flex items-center justify-center w-40 h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">친환경 현수막</span>
            </button>
            <button
              onClick={() => navigateTo(routes.itemsBiodegradable)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">생분해 제품</span>
            </button>
            <button
              onClick={() => navigateTo(routes.itemsRecycle)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">재활용 제품</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />
        </div>
      </div>
    </Layout>
  );
};

export default Banner;

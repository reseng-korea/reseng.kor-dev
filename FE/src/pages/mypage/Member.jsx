import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const Member = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <div className="mt-16 mb-6 text-3xl font-bold">마이페이지</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.mypageMember)}
              className="flex items-center justify-center h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">업체 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageManage)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">현수막 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOrder)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">현수막 발주</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageQr)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">QR 발생기</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageUser)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">회원 정보 수정</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />
        </div>
      </div>
    </Layout>
  );
};

export default Member;

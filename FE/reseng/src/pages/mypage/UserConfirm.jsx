import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const UserConfirm = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex flex-col min-h-screen items-center justify-center pt-16">
        <div className="w-full max-w-2xl justify-center items-center flex flex-col mb-1 space-x-2">
          <span className="text-3xl font-bold mb-6">회원 정보 확인</span>
          <span className="text-sm lg:text-lg mb-2">
            고객님의 소중한 정보 보호를 위해 비밀번호를 다시 한 번 확인해
            주세요.
          </span>
          <span className="text-sm text-[#999999] mb-8">
            고객님의 비밀번호가 타인에게 노출되지 않도록 조심해 주세요.
          </span>
          <hr className="w-full border-t border-black mb-12" />

          <div className="flex flex-col w-full max-w-lg mb-12">
            <label className="text-lg mb-1 self-start">비밀번호</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 mb-1 mx-auto"
              placeholder="비밀번호를 입력해주세요"
            />
          </div>

          <button
            onClick={() => navigateTo(routes.mypageUserEdit)}
            type="submit"
            className="w-[30%] mb-2 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
          >
            확인
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default UserConfirm;

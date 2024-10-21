import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const UserConfirm = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mb-1 space-x-2">
          <span className="pt-16 mb-6 text-3xl font-bold">회원 정보 확인</span>
          <span className="mb-2 text-sm lg:text-lg">
            고객님의 소중한 정보 보호를 위해 비밀번호를 다시 한 번 확인해
            주세요.
          </span>
          <span className="mb-8 text-sm text-gray3">
            고객님의 비밀번호가 타인에게 노출되지 않도록 조심해 주세요.
          </span>
          <hr className="w-full mb-12 border-t border-gray4" />

          <div className="flex flex-col w-full max-w-lg mb-12">
            <label className="self-start mb-1 text-lg">비밀번호</label>
            <input
              type="password"
              className="w-full p-2 mb-1 border rounded-lg mx-auto"
              placeholder="비밀번호를 입력해주세요"
            />
          </div>

          <button
            onClick={() => navigateTo(routes.mypageUserEdit)}
            type="submit"
            className="w-[30%] py-2 px-4 mb-2 font-bold text-white bg-primary rounded-lg hover:bg-white hover:text-primary"
          >
            확인
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default UserConfirm;

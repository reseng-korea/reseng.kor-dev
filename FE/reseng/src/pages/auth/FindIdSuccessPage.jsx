import { useNavigateTo } from '../../hooks/useNavigateTo';
import { FaCircleCheck } from 'react-icons/fa6';

const FindIdSuccessPage = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16">
      <div className="w-full max-w-3xl p-8 rounded-lg shadow-md flex flex-col items-center">
        <FaCircleCheck className="mb-8 text-7xl text-primary" />
        <h2 className="mb-6 text-2xl font-bold">아이디 찾기 완료</h2>
        <span className="mb-2 text-sm">
          개인정보 도용에 대한 피해 방지를 위하여 아이디 일부는 숨김 처리됩니다.
        </span>
        <hr className="w-full mt-2 mb-6 border-t-2 border-primary" />
        <span className="py-10">
          회원님의 정보와 일치하는 아이디는 nayeon**@gmail.com 입니다.
        </span>

        <div className="flex items-center justify-center w-full px-3 py-2 mb-4 space-x-4">
          <button
            onClick={() => navigateTo(routes.pwinquiry)}
            type="submit"
            className="w-1/4 px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg hover:bg-primary hover:text-white"
          >
            비밀번호 찾기
          </button>
          <button
            onClick={() => navigateTo(routes.idinquiry)}
            type="submit"
            className="w-1/4 px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdSuccessPage;

import { TbXboxXFilled } from 'react-icons/tb';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const FindIdFailurePage = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 slide-up">
      <div className="w-full max-w-3xl p-8 flex flex-col items-center">
        <TbXboxXFilled className="mb-8 text-7xl text-warning" />
        <h2 className="text-2xl font-bold mb-2 ">아이디 찾기 실패</h2>
        <hr className="w-full mt-2 mb-6 border-t-2 border-primary" />
        <span className="py-16">
          입력하신 업체명, 휴대폰 번호로 가입된 정보가 없습니다.
        </span>

        <div className="flex items-center justify-center w-full px-3 py-2 mb-4 space-x-4">
          <button
            onClick={() => navigateTo(routes.signin)}
            type="submit"
            className="w-1/4 px-4 py-3 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg hover:bg-hoverLight hover:border-hoverLight"
          >
            로그인
          </button>
          <button
            onClick={() => navigateTo(routes.idinquiry)}
            type="submit"
            className="w-1/4 px-4 py-3 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
          >
            아이디 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdFailurePage;

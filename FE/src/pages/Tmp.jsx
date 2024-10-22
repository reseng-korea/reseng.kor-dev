// 임시페이지임 삭제 예정
import { useNavigateTo } from '../hooks/useNavigateTo';

const Tmp = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
      <div className="w-full flex flex-col mb-1 space-x-2">
        <button onClick={() => navigateTo(routes.socialinfo)}>
          간편 로그인 시 추가정보 입력 페이지
        </button>
        <button onClick={() => navigateTo(routes.idinquirySuccess)}>
          아이디 찾기 성공 페이지
        </button>
        <button onClick={() => navigateTo(routes.idinquiryFailure)}>
          아이디 찾기 실패 페이지
        </button>
        <button onClick={() => navigateTo(routes.pwinquiryNew)}>
          비밀번호 변경 페이지
        </button>
        <button onClick={() => navigateTo(routes.itemsBanner)}>
          아이템 페이지
        </button>
        <button onClick={() => navigateTo(routes.mypageMember)}>
          마이페이지
        </button>
        <button onClick={() => navigateTo(routes.mypageWithdraw)}>
          탈퇴페이지
        </button>
        <button onClick={() => navigateTo(routes.qnaDetail)}>
          1:1 문의 상세 페이지
        </button>
      </div>
    </div>
  );
};
export default Tmp;

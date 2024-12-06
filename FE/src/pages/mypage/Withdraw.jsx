import withdraw_icon from './../../assets/withdraw_icon.png';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const Withdraw = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 slide-up">
      <div className="flex flex-col items-center w-full max-w-2xl p-8 mx-auto text-center">
        <img
          src={withdraw_icon}
          alt="탈퇴 아이콘"
          className="w-16 h-16 mb-12"
        />
        <span className="mb-6 text-xl font-bold lg:text-2xl">
          회원 탈퇴가 완료되었습니다.
        </span>
        <span className="mb-16 text-sm lg:text-lg">
          그동안 Re&生을 이용해 주셔서 감사합니다.
          <br />
          항상 끊임없이 성장하고 발전하는 Re&生이 되겠습니다.
        </span>

        <button
          onClick={() => {
            navigateTo(routes.home);
            window.location.reload();
          }}
          type="submit"
          className="w-[25%] py-3 px-4 mb-20 font-bold text-white bg-primary rounded-lg hover:bg-hover"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Withdraw;

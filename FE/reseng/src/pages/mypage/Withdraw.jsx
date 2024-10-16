import withdraw_icon from './../../assets/withdraw_icon.png';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Withdraw = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16">
      <div className="flex flex-col w-full max-w-2xl items-center p-8 text-center mx-auto">
        <img
          src={withdraw_icon}
          alt="탈퇴 아이콘"
          className="w-16 h-16 mb-12"
        ></img>
        <span className="text-2xl font-bold mb-6">
          회원 탈퇴가 완료되었습니다.
        </span>
        <span className="text-lg mb-16">
          그동안 Re&生을 이용해 주셔서 감사합니다.
          <br />
          항상 끊임없이 성장하고 발전하는 Re&生이 되겠습니다.
        </span>

        <button
          onClick={() => navigateTo(routes.home)}
          type="submit"
          className="w-[25%] mb-20 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default Withdraw;

import { useNavigate } from 'react-router-dom';

import { FaCircleCheck } from 'react-icons/fa6';

const FindIdSuccessPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleFindPassword = () => {
    navigate('/pwinquiry');
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen pt-16">
      <div className="w-full max-w-3xl p-8 shadow-md rounded-lg flex flex-col items-center">
        <FaCircleCheck className="text-[#2EA642] text-7xl mb-8" />
        <h2 className="text-2xl font-bold mb-6">아이디 찾기 완료</h2>
        <span className="text-sm mb-2">
          개인정보 도용에 대한 피해 방지를 위하여 아이디 일부는 숨김 처리됩니다.
        </span>
        <hr className="w-full border-t-2 border-[#2EA642] mt-2 mb-6" />
        <span className="py-10">
          회원님의 정보와 일치하는 아이디는 nayeon**@gmail.com 입니다.
        </span>

        <div className="w-full mb-4 flex items-center justify-center px-3 py-2 space-x-4">
          <button
            onClick={handleFindPassword}
            type="submit"
            className="w-1/4 bg-white border-[#2EA642] text-[#2EA642] font-bold py-2 px-4 rounded-lg hover:bg-[#2EA642] hover:text-white transition-colors duration-300"
          >
            비밀번호 찾기
          </button>
          <button
            onClick={handleLogin}
            type="submit"
            className="w-1/4 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-[#2EA642] transition-colors duration-300"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdSuccessPage;

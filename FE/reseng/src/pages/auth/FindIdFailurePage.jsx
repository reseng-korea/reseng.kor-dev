import { useNavigate } from 'react-router-dom';

import { TbXboxXFilled } from 'react-icons/tb';

const FindIdFailurePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleFindId = () => {
    navigate('/id');
  };

  return (
    <div className=" flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-3xl p-8 shadow-md rounded-lg flex flex-col items-center">
        <TbXboxXFilled className="text-[#F75252] text-7xl mb-8" />
        <h2 className="text-2xl font-bold">아이디 찾기 실패</h2>
        <span className="text-sm py-16">
          입력하신 업체명, 휴대폰 번호로 가입된 정보가 없습니다.
        </span>

        <div className="w-full mb-4 flex items-center justify-center px-3 py-2 space-x-4">
          <button
            onClick={handleLogin}
            type="submit"
            className="w-1/4 bg-white border-[#2EA642] text-[#2EA642] font-bold py-2 px-4 rounded-lg hover:bg-[#2EA642] hover:text-white transition-colors duration-300"
          >
            로그인
          </button>
          <button
            onClick={handleFindId}
            type="submit"
            className="w-1/4 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-[#2EA642] transition-colors duration-300"
          >
            아이디 찾기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindIdFailurePage;

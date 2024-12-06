import { useNavigateTo } from '../hooks/useNavigateTo';
import { useNavigate } from 'react-router-dom';

import earth from '../assets/notfoundpage_earth.png';
import four from '../assets/notfoundpage_four.png';
import e from '../assets/notfoundpage_e.png';
import r from '../assets/notfoundpage_r.png';
import o from '../assets/notfoundpage_o.png';

const NotFoundPage = () => {
  const { navigateTo, routes } = useNavigateTo();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 slide-up">
      <div className="w-full max-w-3xl p-8 flex flex-col items-center">
        <div className="flex justify-center items-center">
          <img className="w-1/6 h-1/6" src={four} />
          <img className="w-1/6 h-1/6" src={earth} />
          <img className="w-1/6 h-1/6" src={four} />
        </div>
        {/* <div className="flex justify-center items-center mt-3">
          <img className="w-[60px] h-1/6" src={e} />
          <img className="w-[60px] h-1/6" src={r} />
          <img className="w-[60px] h-1/6" src={r} />
          <img className="w-[60px] h-1/6" src={o} />
          <img className="w-[60px] h-1/6" src={r} />
        </div> */}
        <div className="flex flex-col justify-center items-center mt-12">
          <span className="text-3xl text-re mb-4">
            죄송합니다. 페이지를 찾을 수 없습니다.
          </span>
          <span className="text-md text-gray3 mb-1">
            존재하지 않는 주소를 입력하셨거나,
          </span>
          <span className="text-md text-gray3 mb-1">
            요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
          </span>
          <span className="text-md text-gray3">
            또는, 접근이 제한된 페이지일 수 있습니다.
          </span>
          <span></span>
        </div>
        <div className="flex items-center justify-center w-full px-3 py-2 mt-12 space-x-4">
          <button
            onClick={() => navigateTo(routes.home)}
            type="submit"
            className="w-1/4 px-4 py-3 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
          >
            메인으로
          </button>
          <button
            onClick={handleGoBack}
            type="submit"
            className="w-1/4 px-4 py-3 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg hover:bg-hoverLight hover:border-hoverLight"
          >
            이전 페이지
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

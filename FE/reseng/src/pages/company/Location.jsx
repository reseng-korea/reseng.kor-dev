import Layout from '../../components/Layouts';

import { useNavigate } from 'react-router-dom';

const Location = () => {
  const navigate = useNavigate();

  const handleCompany = () => {
    navigate('/company');
  };

  const handleHistory = () => {
    navigate('/history');
  };

  const handleLocation = () => {
    navigate('/location');
  };
  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
        <div className="w-full flex flex-col mb-1 space-x-2">
          <div className="text-3xl font-bold mb-6">회사 소개</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCompany}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">회사 소개</span>
            </button>
            <button
              onClick={handleHistory}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">연혁</span>
            </button>
            <button
              onClick={handleLocation}
              className="w-30 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none"
            >
              <span className="text-[#2EA642] font-bold">오시는 길</span>
            </button>
          </div>
          <hr className="w-full border-t border-[#99999] mb-6" />
        </div>
      </div>
    </Layout>
  );
};

export default Location;

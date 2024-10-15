import Layout from '../../components/Layouts';
import { useNavigate } from 'react-router-dom';
import { tmplocationdata } from '../data/tmplocationdata';

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

          {/* A 구역: 리스트 */}
          <div className="flex min-h-screen gap-x-6">
            <div
              className="w-1/3 bg-transition border border-[#999999] p-4 rounded-2xl"
              style={{ maxHeight: '73vh' }}
            >
              <div className="h-full">
                <h1 className="text-2xl font-bold mt-2 mb-4">업체 목록</h1>
                <div
                  className="h-full overflow-y-auto px-2"
                  style={{ maxHeight: '60vh' }}
                >
                  {tmplocationdata.map((item, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 border border-[#999999] text-left rounded-2xl hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
                    >
                      <p className="text-[10px] sm:text-sm md:text-lg lg:text-xl font-bold mb-2">
                        {item.type}
                      </p>
                      <hr className="mt-2 mb-2" />
                      <p className="text-[10px] sm:text-sm md:text-lg font-bold mb-2">
                        {item.name}
                      </p>
                      <div className="flex justify-center">
                        <p className="flex-shrink-0 text-[10px] sm:text-sm mb-1 mr-1">
                          주소 :
                        </p>
                        <p className="flex-grow text-[10px] sm:text-sm mb-1">
                          {item.address}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <p className="flex-shrink-0 text-[10px] sm:text-sm mb-1 mr-1">
                          전화 :
                        </p>
                        <p className="flex-grow text-[10px] sm:text-sm mb-1">
                          {item.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* B 구역: 지도 */}
            <div className="w-2/3 bg-green-100 p-4">
              <h1 className="text-2xl font-bold">오시는 길</h1>
              {/* 여기에는 실제 지도 또는 관련 콘텐츠를 넣으면 됩니다 */}
              <p>이곳에 지도가 들어갑니다.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Location;

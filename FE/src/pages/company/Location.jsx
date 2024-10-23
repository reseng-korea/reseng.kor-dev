import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { tmplocationdata } from '../../data/tmplocationdata';
import KakaoMap from '../../components/Map/KakaoMap';

const Location = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2">
        <div className="flex flex-col w-full">
          <div className="mt-16 mb-6 text-3xl font-bold">회사 소개</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.company)}
              className="flex items-center justify-center w-30 h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">회사 소개</span>
            </button>
            <button
              onClick={() => navigateTo(routes.history)}
              className="flex items-center justify-center w-30 h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">연혁</span>
            </button>
            <button
              onClick={() => navigateTo(routes.location)}
              className="flex items-center justify-center w-30 h-10 border-0 border-b-2 border-primary rounded-none bg-transition"
            >
              <span className="font-bold text-primary">오시는 길</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />

          {/* A 구역: 업체 목록 */}
          {/* api 연결하면 데이터 가져와서 바로 넣어주면 될듯(지금은 더미데이터) */}

          <div
            className="flex gap-x-6"
            style={{ height: 'calc(100vh - 230px)' }}
          >
            <div
              className="w-1/3 p-4 border border-gray3 rounded-2xl bg-transition"
              style={{ height: '100%' }}
            >
              <div className="flex flex-col h-full">
                <h1 className="mt-2 mb-4 text-sm font-bold sm:text-lg lg:text-2xl">
                  업체 목록
                </h1>
                <div className="flex-grow px-2 overflow-y-auto">
                  {tmplocationdata.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 mb-4 text-left border border-gray3 rounded-2xl hover:bg-placeHolder hover:shadow-lg transition-all duration-300"
                    >
                      <p className="mb-2 text-[10px] font-bold sm:text-sm md:text-lg lg:text-xl">
                        {item.type}
                      </p>
                      <hr className="mt-2 mb-2" />
                      <p className="mb-2 text-[10px] font-bold sm:text-sm md:text-lg">
                        {item.name}
                      </p>
                      <div className="flex justify-center">
                        <p className="mr-1 mb-1 text-[10px] flex-shrink-0 sm:text-sm">
                          주소 :
                        </p>
                        <p className="mb-1 text-[10px] flex-grow sm:text-sm">
                          {item.address}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <p className="mr-1 mb-1 text-[10px] flex-shrink-0 sm:text-sm">
                          전화 :
                        </p>
                        <p className="mb-1 text-[10px] flex-grow sm:text-sm">
                          {item.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* B 구역: 지도 */}
            {/* 목록들 가져와서 지도에 마커로 뿌리기 */}
            {/* 본사, 총판, 대리점의 마커 색을 다르게 해야할까 고민 */}
            {/* 마커 띄울 때 이름도 띄워야할 지에 대해서도 고민 */}
            <div className="w-2/3">
              <KakaoMap />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Location;

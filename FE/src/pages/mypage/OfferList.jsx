import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const OfferList = () => {
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="현수막 발주"
            mainCategory="마이페이지"
          />
          {/* 더 하위 카테고리 */}
          <div className="flex justify-center space-x-2 mb-4">
            <button
              onClick={() => navigateTo(routes.mypageOrder)}
              className="flex items-center justify-center h-10 rounded-none bg-gray1 hover:text-lg"
            >
              <span className="text-black">발주</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOrderList)}
              className="flex items-center justify-center h-10 rounded-none bg-gray1 hover:text-lg"
            >
              <span className="text-black">발주 내역</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOfferList)}
              className="flex items-center justify-center h-10 rounded-none bg-primary hover:text-lg"
            >
              <span className="text-white">발주 받은 내역</span>
            </button>
          </div>
          {/* 메인 */}
          {/* 전체 */}
          <div className="flex w-full space-x-4">
            <div className="flex flex-col w-4/5 mx-auto rounded-lg border border-gray4 justify-center items-center">
              {/* 업체명, 대리점 명 */}
              <div className="flex flex-wrap w-full justify-start items-center my-4">
                <div className="flex w-full md:w-1/2 justify-end items-center space-x-4">
                  <span className="w-1/5 text-right font-bold">업체명</span>
                  <div className="w-3/5 px-4 py-2 border border-gray4 rounded-lg text-left">
                    내 자식 명
                  </div>
                </div>
                <div className="flex w-full md:w-1/2 justify-start items-center space-x-4">
                  <span className="w-1/5 text-right font-bold">날짜</span>
                  <div className="w-3/5 px-4 py-2 border border-gray4 rounded-lg text-left">
                    2024.10.11
                  </div>
                </div>
              </div>
              {/* 내역 */}
              <div className="flex flex-wrap w-full justify-start items-center my-2">
                <div className="flex w-full md:w-1/2 justify-center items-center px-12 space-x-16 mb-4">
                  <div className="flex w-1/3 justify-center items-center">
                    <span className="inline-flex justify-center items-center px-2 py-2 w-10 h-10 border border-gray3 rounded-lg">
                      1
                    </span>
                  </div>
                  <div className="w-1/3 justify-center items-center">700m</div>
                  <div className="w-1/3 justify-center items-center">5롤</div>
                </div>
                <div className="flex w-full md:w-1/2 justify-center items-center px-12 space-x-16 mb-4">
                  <div className="flex w-1/3 justify-center items-center">
                    <span className="inline-flex justify-center items-center px-2 py-2 w-10 h-10 border border-gray3 rounded-lg">
                      2
                    </span>
                  </div>
                  <div className="w-1/3 justify-center items-center">1500m</div>
                  <div className="w-1/3 justify-center items-center">2롤</div>
                </div>
                <div className="flex w-full md:w-1/2 justify-center items-center px-12 space-x-16 mb-4">
                  <div className="flex w-1/3 justify-center items-center">
                    <span className="inline-flex justify-center items-center px-2 py-2 w-10 h-10 border border-gray3 rounded-lg">
                      3
                    </span>
                  </div>
                  <div className="w-1/3 justify-center items-center">900m</div>
                  <div className="w-1/3 justify-center items-center">10롤</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/5 justify-center items-center px-4 py-8 rounded-lg border border-gray4">
              <span className="w-full text-lg font-bold mb-6">
                상태 업데이트
              </span>
              <select className="w-2/3 p-2 rounded-lg border border-gray3">
                <option value="">미확인</option>
                <option value="800m">확인 완료</option>
                <option value="900m">출고 완료(택배)</option>
                <option value="1300m">출고 완료(화물)</option>
              </select>
              {/* <div className="w-2/3 py-2 mt-3"> */}
              <button className="w-2/3 items-center justify-center border border-gray3 mt-3">
                <span>저장</span>
              </button>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferList;

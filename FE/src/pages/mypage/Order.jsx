import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Order = () => {
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
              className="flex items-center justify-center h-10 rounded-none bg-primary hover:text-lg"
            >
              <span className="text-white">발주</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOrderList)}
              className="flex items-center justify-center h-10 rounded-none bg-gray1 hover:text-lg"
            >
              <span className="text-black">발주 내역</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOfferList)}
              className="flex items-center justify-center h-10 rounded-none bg-gray1 hover:text-lg hover:border-none"
            >
              <span className="text-black">발주 받은 내역</span>
            </button>
          </div>
          {/* 메인 */}
          <div>
            <div className="flex justify-center py-4 border border-gray3 rounded-lg mb-6 space-x-4">
              <div className="flex w-4/5">
                <div className="flex w-1/2 items-center justify-end space-x-4">
                  <span className="text-lg font-bold">폭</span>
                  <select className="w-2/3 p-2 rounded-lg border border-gray3">
                    <option value="">105mm</option>
                    <option value="800m">100mm</option>
                    <option value="900m">90mm</option>
                    <option value="1300m">80mm</option>
                    <option value="1400m">75mm</option>
                    <option value="1700m">30mm</option>
                  </select>
                </div>
                <div className="flex w-1/2 items-center justify-center space-x-4">
                  <span className="text-lg font-bold">롤</span>
                  <input
                    className="w-2/3 p-2 rounded-lg border border-gray3"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex px-5 justify-end w-1/5">
                <button className="flex items-center justify-center h-10 border border-warning">
                  <span>삭제</span>
                </button>
              </div>
            </div>
            <div className="flex justify-center py-4 border border-gray3 rounded-lg mb-6 space-x-4">
              <div className="flex w-4/5">
                <div className="flex w-1/2 items-center justify-end space-x-4">
                  <span className="text-lg font-bold">폭</span>
                  <select className="w-2/3 p-2 rounded-lg border border-gray3">
                    <option value="">105mm</option>
                    <option value="800m">100mm</option>
                    <option value="900m">90mm</option>
                    <option value="1300m">80mm</option>
                    <option value="1400m">75mm</option>
                    <option value="1700m">30mm</option>
                  </select>
                </div>
                <div className="flex w-1/2 items-center justify-center space-x-4">
                  <span className="text-lg font-bold">롤</span>
                  <input
                    className="w-2/3 p-2 rounded-lg border border-gray3"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex px-5 justify-end w-1/5">
                <button className="flex items-center justify-center h-10 border border-warning">
                  <span>삭제</span>
                </button>
              </div>
            </div>
            <div className="py-4 border border-gray3 rounded-lg mb-6">
              <span className="text-lg font-bold">+ 추가하기</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="flex px-6 items-center justify-center h-10 border border-primary">
                <span className="font-bold">초기화</span>
              </button>
              <button className="flex px-8 items-center justify-center h-10 bg-primary">
                <span className="text-white font-bold">발주 넣기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import ecoen from './../../assets/ecoen.jpg';

const Biodegradable = () => {
  const navItems = [
    { label: '친환경 현수막', route: '/items/banner' },
    { label: '생분해 제품', route: '/items/biodegradable' },
    { label: '재활용 제품', route: '/items/recycle' },
  ];

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="생분해 제품"
            mainCategory="아이템"
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-4/5 text-left">
          <div className="text-left text-2xl font-bold mb-10">
            1. 소재
          </div>
          <div className="flex justify-center px-3 py-2 mb-10 relative h-auto">
            <div className="flex justify-center w-1/3 h-auto p-5">
              <img
                  src={ecoen}
                  alt="에코엔"
                />
            </div>
            <div className="w-0.5 bg-primary"></div>
            <div className="flex flex-col w-2/3 justify-center text-left pl-5">
              <span className="mb-3">
              <strong>(주)휴비스</strong>의 <strong>에코엔</strong>은 미생물에 의해 <strong>생분해가 가능</strong>한 고내열성 생분해 <strong>폴리에스테르 원사</strong>입니다.
              </span>
              <span className="mb-3">
                기존 폴리에스터에서 소각시 발생하는 <strong>CO2 및 유해 가스</strong>가 <strong>ecoen에서는 발생하지 않고</strong>,
              </span>
              <span className="mb-3">
                <strong>매립 시 발생하는 토양의 오염문제를 해결</strong>하였습니다.
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold pt-20 mb-10">
            2. 아이템 설명
          </div>
          <div className="flex flex-col justify-center px-3 py-2 mb-10 relative h-auto">
            <div className="flex flex-col justify-center text-left">
              <span className="mb-3">
                일상 제품을 사용함에 있어서도 매립에 대한 대비가 가능한 아이템입니다!
              </span>
              <span className="mb-3">
                현재 저희 대전 총판 <strong>(주)글로벌소담</strong>에서 친환경 수세미를 판매 중에 있으니 아래 링크 확인 부탁드립니다.
              </span>
              <div className="flex justify-center items-center mt-10">
                <button className="mt-3 top-4 right-4 border border-black text-black text-lg hidden md:block md:text-sm lg:text-lg py-2 px-4 bg-transparent hover:bg-green-800 hover:text-white hover:border-white transition duration-300"
                  onClick={() => (window.location.href = "https://m.globalsodam.com/shop_goods/goods_view.htm?category=01010000&goods_idx=259116&goods_bu_id=sodam")}>
                  구경하러 가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Biodegradable;

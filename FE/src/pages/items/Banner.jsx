import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import ecoen from './../../assets/ecoen.jpg';
import logo from './../../assets/logo.png';

const Banner = () => {
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
            activePage="친환경 현수막"
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
            <div className="flex flex-col w-2/3 justify-center text-left">
              <span className="mb-3">
                현재 현수막은 다음과 같은 이유로 줄이기 쉽지 않은 상황입니다.
              </span>
            </div>
            <div className="flex flex-col items-center border-2 border-green-800 rounded-lg mt-10 mb-10 pl-10 pr-10 pt-5 pb-5 w-auto self-center">
              <div className="flex flex-col text-left">
                <span className="mb-3 font-bold">
                  1. 가격대비 가장 효과적인 소상공인들의 홍보수단
                </span>
                <span className="mb-3 font-bold">
                  2. 정당 현수막, 각종 축제 및 행사 등으로 현수막 사용 범위가 확대되는 경향
                </span>
              </div>
            </div>
            <div className="flex flex-col w-2/3 justify-center text-left">
              <span className="mb-3">
                따라서, <strong>(주)리앤생</strong>은 다음과 같은 문제점들을 해결하기 위해 노력하였습니다.
              </span>
            </div>
            <div className="flex flex-col items-center border-2 border-green-800 rounded-lg mt-10 mb-10 pl-10 pr-10 pt-5 pb-5 w-auto self-center">
              <div className="flex flex-col text-left">
                <span className="mb-3 font-bold">
                  1. 매립장 부족
                </span>
                <span className="mb-3 font-bold">
                  2. 일반 플라스틱 소재 현수막 분해에 500년 이상 소요
                </span>
                <span className="mb-3 font-bold">
                  3. 소각시 4kg 이상의 온실가스와 다이옥신과 같은 1급 발암물질 발생
                </span>
              </div>
            </div>
            <div className="flex mt-10 mb-10 pb-10">
              <div className="flex justify-center w-1/3 h-auto">
                <img
                    src={logo}
                    alt="로고"
                    className="w-2/3 h-auto"
                  />
              </div>
              <div className="flex flex-col w-2/3 justify-center text-left">
                <span className="mb-3">
                  <strong>(주)리앤생</strong> 현수막은 생분해성 소재인 <strong>에코엔</strong>을 사용하여 생분해 되는 현수막을 제작합니다.
                </span>
                <span className="mb-3">
                  기존 현수막이 생분해에 500년 이상이 걸린다면 리앤생 현수막은 생분해에 2~3년이 걸립니다.
                </span>
                <span className="mb-3">
                  이로써 매립이 되는 현수막에 대해 더욱 친환경적인 처리가 가능합니다.
                </span>
              </div>
            </div>
            <div className="flex flex-col w-2/3 justify-center text-left">
              <span className="mb-3">
                이 뿐만 아니라, 리싸이클 원료로 만들어진 소재를 사용하여 다음과 같은 효과를 얻을 수 있습니다.
              </span>
            </div>
            <div className="flex flex-col items-center border-2 border-green-800 rounded-lg mt-10 mb-10 pl-10 pr-10 pt-5 pb-5 w-auto self-center">
              <div className="flex flex-col text-left">
                <span className="mb-3 font-bold">
                  1. 친환경 현수막 탄소 배출량 저감 효과 : 2.00 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 font-bold">
                  - 화석원료로 생산한 현수막 탄소 배출량 : 2.59 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 font-bold">
                  - 리싸이클 원료로 생산한 친환경 현수막 탄소 배출량 : 0.59 kgCO2/kg
                </span>
              </div>
            </div>
            <div className="flex flex-col w-2/3 justify-center text-left">
              <span className="mb-3">
                현재 많은 지자체들이 <strong>친환경 현수막 사용 촉진 및 재활용 조례</strong>를 제정하여 친환경 현수막 행보에 동참하고 있습니다!
              </span>
            </div>
            <div className="flex flex-col w-2/3 justify-center text-left">
              <span className="mb-3 font-bold">
                여러분도 친환경 현수막을 사용하여 친환경의 행보에 동참하세요!
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Banner;

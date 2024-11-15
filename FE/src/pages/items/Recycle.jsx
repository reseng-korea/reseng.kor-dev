import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import logo from './../../assets/logo.png';
import parasol from './../../assets/upcycling parasol.png';
import sack from './../../assets/upcycling sack.png';
import umbrella from './../../assets/upcycling umbrella.png';
import inner_car from './../../assets/main3_3.png';

const Recycle = () => {
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
            activePage="재활용 제품"
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
                  src={logo}
                  alt="리앤생"
                  className="w-1/2 h-auto"
                />
            </div>
            <div className="w-0.5 bg-primary"></div>
            <div className="flex flex-col w-2/3 justify-center text-left pl-5">
              <span className="mb-3">
                <strong>(주)리앤생</strong>의 <strong>친환경 현수막</strong>은 사용되고 난 뒤 수거 및 자원화되어 재활용 제품으로 다시 태어납니다.
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold pt-20 mb-10">
            2. 아이템 설명
          </div>
          <div className="flex flex-col justify-center px-3 py-2 mb-5 relative h-auto">
            <div className="flex flex-col justify-center text-left">
              <span className="mb-3">
                현재 폐현수막은 다양한 형태로 업사이클링 되고 있습니다.
              </span>
            </div>
            <div className="flex items-center w-2/3 border-2 border-green-800 rounded-lg p-3 mt-5 mb-10 self-center">
              <div className="flex flex-col justify-center p-3 w-1/3">
                <img
                    src={sack}
                    alt="마대"
                  />
                <span className="text-center mt-3"><strong>청소용 마대</strong></span>
              </div>
              <div className="flex flex-col justify-center p-3 w-1/3">
                <img
                    src={umbrella}
                    alt="우산"
                  />
                <span className="text-center mt-3"><strong>청소용 마대</strong></span>
              </div>
              <div className="flex flex-col justify-center p-3 w-1/3">
                <img
                    src={parasol}
                    alt="파라솔"
                  />
                <span className="text-center mt-3"><strong>청소용 마대</strong></span>
              </div>
            </div>
            <div className="flex flex-col justify-center px-3 py-2 mb-5 relative h-auto">
              <div className="flex flex-col justify-center text-left">
                <span className="mb-3">
                  하지만 햇빛을 받으면 코팅층이 분말이 되어 호흡기에 들어가 건강에 위험을 초래할 수 있습니다.
                </span>
                <span className="mb-3">
                  따라서, 현수막 자체로는 재활용에 적당한 소재가 아닙니다.
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center px-3 py-2 mb-5 relative h-auto">
              <div className="flex flex-col justify-center text-left">
                <span className="mb-3">
                  이를 해결하기 위해 화학재생을 거쳐 다시 원사로 생산하는 기술이 필요합니다.
                </span>
                <span className="mb-3">
                  <strong>(주)리앤생</strong>은 <strong>(주)휴비스</strong>와 손잡아 폐현수막 리싸이클을 목표로 합니다.
                </span>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold pt-20 mb-10">
            3. 개발 진행 상황
          </div>
          <div className="flex flex-col justify-center px-3 py-2 mb-5 relative h-auto">
            <div className="flex flex-col justify-center text-left">
              <span className="mb-3">
                현재 자동차 내장재로의 재활용이 개발 중입니다.
              </span>
              <span className="mb-3">
                대략적인 과정은 다음과 같습니다.
              </span>
            </div>
            <div className="flex flex-col items-center border-2 border-green-800 rounded-lg mt-10 mb-5 pl-10 pr-10 pt-5 pb-5 w-auto self-center">
              <div className="flex text-left">
                <span className="mb-3 mr-3 font-bold">
                  1. 현수막 사용 및 수거
                </span>
                <span className="mb-3 mr-3 font-bold">
                  →
                </span>
                <span className="mb-3 mr-3 font-bold">
                  2. 코팅층을 벗기기 위한 전처리 및 팝콘화
                </span>
                <span className="mb-3 mr-3 font-bold">
                  →
                </span>
                <span className="mb-3 mr-3 font-bold">
                  3. 해중합이라는 화학재생을 통한 칩 생산
                </span>
                <span className="mb-3 mr-3 font-bold">
                  →
                </span>
              </div>
              <div className="flex text-left">
                <span className="mb-3 mr-3 font-bold">
                  4. 칩을 사용하여 CR-LMF 생산
                </span>
                <span className="mb-3 mr-3 font-bold">
                  →
                </span>
                <span className="mb-3 mr-3 font-bold">
                  5. 자동차 내장재 생산
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center border-2 border-green-800 rounded-lg p-5 mt-5 mb-10 self-center">
              <img
                  src={inner_car}
                  alt="자동차 내장재"
                />
                <span className="text-center mt-3"><strong>자동차 내장재</strong></span>
            </div>
            <div className="flex flex-col justify-center px-3 py-2 mb-5 relative h-auto">
              <div className="flex flex-col justify-center text-left">
                <span className="mb-3">
                  이러한 리싸이클링 과정을 통하여 다음과 같은 효과를 얻을 수 있습니다.
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center border-2 border-green-800 rounded-lg mt-5 mb-10 pl-10 pr-10 pt-5 pb-5 w-auto self-center">
              <div className="flex flex-col text-left">
                <span className="mb-3 mr-3 font-bold">
                  1. 폐현수막 재활용 탄소배출량 저감 효과 : 3.56 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 mr-3 font-bold">
                  - 화석원료로 생산한 자동차 섬유 탄소 배출량 : 2.80 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 mr-3 font-bold">
                  - 폐현수막 소각시 발생하는 탄소 배출량 : 2.35 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 mr-3 font-bold">
                  - 화학재생 자동차용 섬유 탄소 배출량 : 1.59 kgCO2/kg
                </span>
                <span className="mb-3 mr-3 font-bold">
                  2. 타사 대비 ㈜휴비스 화학재생 탄소 배출량 저감 효과 : 1.36 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 mr-3 font-bold">
                  - 타사 화학재생 PET 탄소 배출량 : 2.44 kgCO2/kg
                </span>
                <span className="ml-3 mb-3 mr-3 font-bold">
                  - ㈜휴비스 화학재생 PET 탄소 배출량 : 1.08 kgCO2/kg
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center px-3 py-2 mb-5 relative h-auto">
              <div className="flex flex-col justify-center text-left">
                <span className="mb-3">
                  또한, 유럽의 <strong>"폐차처리지침(ELV)"</strong>에 따르면 <strong>"차량에 쓰이는 플라스틱 중 25%를 재활용 소재로 사용해야 함"</strong>이라고 나와있기에 수출 산업에도 기여 가능합니다!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recycle;

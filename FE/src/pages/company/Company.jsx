import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import logo from '../../assets/logo.png';

const Company = () => {
  const navItems = [
    { label: '회사 소개', route: '/company' },
    { label: '연혁', route: '/history' },
    { label: '오시는 길', route: '/location' },
  ];

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full slide-up">
          <SubNavbar
            items={navItems}
            activePage="회사 소개"
            mainCategory="회사 소개"
          />

          {/* 메인 */}
          {/* 회사 소개 내용 여기에 코드 작성하면 됨 */}
          <div className="flex flex-col">
            <div className="text-center text-lg font-bold text-black sm:text-lg md:text-xl lg:text-3xl fade-in mb-5 mt-5">
              주식회사 리앤생
            </div>
            <div className="flex justify-center items-center w-full mt-10 mb-10 fade-in">
              <div className="flex justify-center items-center w-1/2">
                <img
                  className="w-2/3 animate-zoom-in"
                  src={logo}
                  alt="로고"
                />
              </div>
            </div>
            <div className="mt-10 mb-10">
              <span className="block mb-2">
                주식회사 리앤생은
              </span>
              <span className="block mb-2">
                버려지는 현수막을 위해 생분해성 소재로 만든 현수막을 제공하고,
              </span>
              <span className="block mb-2">
                재활용이 되는 현수막은 자원화하여 다시 생활 속 제품으로 이어지는
              </span>
              <span className="block mb-2">
                폐쇄형 순환 구조를 만들기 위해 노력합니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Company;

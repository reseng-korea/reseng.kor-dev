import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

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
        </div>
      </div>
    </Layout>
  );
};

export default Company;

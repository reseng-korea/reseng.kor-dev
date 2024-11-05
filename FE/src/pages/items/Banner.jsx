import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

const Banner = () => {
  const navItems = [
    { label: '친환경 현수막', route: '/items/banner' },
    { label: '생분해 제품', route: '/items/biodegradable' },
    { label: '재활용 제품', route: '/items/recycle' },
  ];

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="친환경 현수막"
            mainCategory="아이템"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Banner;

import Layout from '../../components/Layouts';

import logo from '../../assets/logo.png';

const QrFailure = () => {
  return (
    <Layout>
      <img className="w-auto h-8 mt-4" src={logo} />
      <div className="flex flex-col w-full min-h-screen pt-16">
        <span className="text-4xl font-bold">QR 정보</span>
        <hr className="w-full mt-6 mb-6 border border-gray2" />
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex justify-center items-center h-64">
            <span className="text-center text-warning text-2xl font-bold">
              잘못된 QR 정보입니다.
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QrFailure;

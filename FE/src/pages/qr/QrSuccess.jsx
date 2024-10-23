import Layout from '../../components/Layouts';

import logo from '../../assets/logo.png';

const QrSuccess = () => {
  return (
    <Layout>
      <img className="w-auto h-8 mt-4" src={logo} />
      <div className="mt-16">
        <div className="flex flex-col justify-center items-center">
          <span className="text-4xl font-bold">QR 정보</span>
          <hr className="w-full mt-6 mb-6 border border-gray2" />
          <span className="text-primary text-2xl font-bold">
            친환경 현수막을 사용해주셔서 감사합니다.
          </span>
          <span className="text-primary text-lg mt-2">
            만약 정보가 다르다면 053-252-6455로 연락해주시면 감사하겠습니다.
          </span>
        </div>

        {/* 테이블을 중앙에 배치하는 부분 */}
        <div className="flex items-center justify-center mt-8">
          <table className="border-collapse border border-gray-300">
            <tbody>
              <tr>
                <th className="border border-gray-300 px-4 py-2">업체명</th>
                <td className="border border-gray-300 px-4 py-2">리앤생</td>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">고객명</th>
                <td className="border border-gray-300 px-4 py-2">이승현</td>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">게시 장소</th>
                <td className="border border-gray-300 px-4 py-2">
                  반포 한강 공원 현수막 게시대
                </td>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">요청 날짜</th>
                <td className="border border-gray-300 px-4 py-2">2024.10.23</td>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">게시 날짜</th>
                <td className="border border-gray-300 px-4 py-2">2024.11.01</td>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">폭</th>
                <td className="border border-gray-300 px-4 py-2">900mm</td>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2">
                  현수막 길이
                </th>
                <td className="border border-gray-300 px-4 py-2">5m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default QrSuccess;

import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import { bannerLengthData } from '../../data/bannerLengthData';
import { tableData } from '../../data/bannerLengthData';

const Manage = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          {/* 하위 카테고리 */}
          <div className="mt-16 mb-6 text-3xl font-bold">마이페이지</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.mypageMember)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">업체 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageManage)}
              className="flex items-center justify-center w-40 h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">현수막 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOrder)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">현수막 발주</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageQr)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">QR 발생기</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageUser)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">
                회원 정보 수정
              </span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />

          {/* 메인 */}
          <div className="flex flex-col">
            <span className="text-lg text-left font-bold mb-4">
              현재 재고 수량
            </span>
            <table className="min-w-full border border-gray4 border-collapse">
              <thead>
                <tr className="border border-gray4">
                  <th className="py-3 border border-gray4">폭</th>
                  <th className="py-3 border border-gray4">정단(120yd) 개수</th>
                  <th className="py-3 border border-gray4">
                    비정단(120yd 외) 길이별 개수
                  </th>
                </tr>
              </thead>
              <tbody>
                {bannerLengthData.map((bannerLength, index) => (
                  <tr key={index} className="border border-gray4">
                    <td className="px-2 py-2 border border-gray4 text-left">
                      {bannerLength}
                    </td>
                    <td className="px-2 py-2 border border-gray4 text-left">
                      {tableData[index].number}
                    </td>
                    <td className="px-2 py-2 border border-gray4 text-left">
                      {tableData[index].value.join(' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Manage;

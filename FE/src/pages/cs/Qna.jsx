import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { inquiryData } from '../data/inquiryData';
import qnaIsSecret from '../../assets/qna_isSecret.png';

const Qna = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  // 번호 기준으로 내림차순 정렬
  const sortedInquiryData = [...inquiryData].sort((a, b) => b.id - a.id);

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          {/* 하위 카테고리 */}
          <div className="mt-16 mb-6 text-3xl font-bold">고객 센터</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.faq)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">자주 묻는 질문</span>
            </button>
            <button
              onClick={() => navigateTo(routes.qna)}
              className="flex items-center justify-center h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">1:1 문의</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />
          {/* 메인 */}
          <table className="min-w-full bg-white border-b mt-4">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-4 px-4 text-xl">번호</th>
                <th className="py-4 px-4 text-xl">제목</th>
                <th className="py-4 px-4 text-xl">작성자</th>
                <th className="py-4 px-4 text-xl">등록일</th>
                <th className="py-4 px-4 text-xl">조회수</th>
              </tr>
            </thead>
            <tbody>
              {sortedInquiryData.map((inquiry) => (
                <tr key={inquiry.id} className="border-b hover:bg-placeHolder">
                  <td className="py-3 px-4 border-b">{inquiry.id}</td>
                  <td className="py-2 px-4 border-b text-left">
                    <div className="flex items-center space-x-2">
                      {inquiry.isSecret ? (
                        <img
                          src={qnaIsSecret}
                          className="w-4 h-4 mr-2"
                          alt="Secret Icon"
                        />
                      ) : (
                        <span className="w-4 h-4 mr-2" /> // 공백을 위한 공간 유지
                      )}
                      {inquiry.title.length > 30
                        ? `${inquiry.title.slice(0, 30)}...`
                        : inquiry.title}
                      {/* <span>{inquiry.title}</span> */}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">{inquiry.author}</td>
                  <td className="py-2 px-4 border-b">{inquiry.date}</td>
                  <td className="py-2 px-4 border-b">{inquiry.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Qna;

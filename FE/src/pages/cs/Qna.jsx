import React, { useState } from 'react';
import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { inquiryData } from '../../data/inquiryData';
import qnaIsSecret from '../../assets/qna_isSecret.png';
import Pagination from 'react-js-pagination';

const Qna = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  // 번호 기준으로 내림차순 정렬
  const sortedInquiryData = [...inquiryData].sort((a, b) => b.id - a.id);

  // 페이지당 표시할 항목 수 설정
  const itemsCountPerPage = 10;

  const [activePage, setActivePage] = useState(1);

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = sortedInquiryData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    navigateTo(`/qna?page=${pageNumber}`);

    setActivePage(pageNumber);
  };

  const handleRowClick = (id) => {
    // URL을 qna/{id}로 변경
    navigateTo(`/qna/${id}`);
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <div className="slide-up">
            {/* 하위 카테고리 */}
            <div className="mt-16 mb-6 text-3xl font-bold">고객 센터</div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigateTo(routes.faq)}
                className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
              >
                <span className="text-black hover:text-primary">
                  자주 묻는 질문
                </span>
              </button>
              <button
                onClick={() => navigateTo(routes.qna)}
                className="flex items-center justify-center w-40 h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
              >
                <span className="font-bold text-primary">1:1 문의</span>
              </button>
            </div>
            <hr className="w-full mb-6 border-t border-gray1" />
          </div>

          {/* 메인 */}
          <div className="flex flex-col w-full">
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
                {currentItems.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="border-b hover:bg-placeHolder"
                    onClick={() => handleRowClick(inquiry.id)}
                  >
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
            <Pagination
              activePage={activePage} //현재 페이지
              itemsCountPerPage={itemsCountPerPage} // 페이지 당 항목 수(10개)
              totalItemsCount={sortedInquiryData.length} // 표시할 항목의 총 개수(전체)
              pageRangeDisplayed={5} //페이지네이터의 페이지 범위
              prevPageText="<"
              firstPageText="≪"
              nextPageText=">"
              lastPageText="≫"
              onChange={handlePageChange}
              innerClass="flex justify-center mt-4"
              activeClass="text-white bg-primary rounded"
              activeLinkClass="text-white hover:text-white" // 활성화된 페이지 스타일 ( 숫자 부분)
              itemClass="group inline-block px-4 py-2 border rounded text-gray4 mt-4 mx-0.5 hover:text-primary hover:border-primary" // 페이지 번호 스타일
              linkClass="group-hover:text-primary text-gray4" // 링크의 기본 스타일
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigateTo(routes.qnaRegist)}
                type="submit"
                className="mb-4 px-12 py-3 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
              >
                글쓰기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Qna;

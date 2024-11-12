import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import qnaIsSecret from '../../assets/qna_isSecret.png';
import Pagination from 'react-js-pagination';

const Qna = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [qnaData, setQnaData] = useState([]);

  // 페이지당 표시할 항목 수 설정
  const itemsCountPerPage = 10;

  const [activePage, setActivePage] = useState(1);

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastItem = activePage * itemsCountPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsCountPerPage;
  const currentItems = [...qnaData].slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    navigateTo(`/qna?page=${pageNumber}`);

    setActivePage(pageNumber);
  };

  const handleRowClick = (id) => {
    // URL을 qna/{id}로 변경
    navigateTo(`/qna/${id}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/qna/questions`);
        console.log(response);

        const qnaItems = response.data.data.content.map((item, index) => ({
          id: index + 1,
          secret: item.secret,
          title: item.title,
          representativeName: item.representativeName,
          createdAt: item.createdAt,
          viewCount: item.viewCount,
          answered: item.answered,
        }));

        setQnaData(qnaItems.reverse());
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="1:1 문의"
            mainCategory="고객 센터"
          />
          {/* 메인 */}
          <div className="flex flex-col w-full slide-up">
            <table className="min-w-full bg-white border-b mt-4">
              <thead>
                <tr className="bg-placeHolder text-gray4 text-lg">
                  <th className="py-4 px-4 rounded-l-lg">번호</th>
                  <th className="py-4 px-4">제목</th>
                  <th className="py-4 px-4">작성자</th>
                  <th className="py-4 px-4">등록일</th>
                  <th className="py-4 px-4">조회수</th>
                  <th className="py-4 px-4 rounded-r-lg">답변 상태</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((items) => (
                  <tr
                    key={items.id}
                    className="border-b hover:bg-placeHolder"
                    onClick={() => handleRowClick(items.id)}
                  >
                    <td className="py-5 px-4 border-b">{items.id}</td>
                    <td className="py-2 px-4 border-b text-left">
                      <div className="flex items-center space-x-2">
                        {items.secret ? (
                          <img
                            src={qnaIsSecret}
                            className="w-4 h-4 mr-2"
                            alt="Secret Icon"
                          />
                        ) : (
                          <span className="w-4 h-4 mr-2" /> // 공백을 위한 공간 유지
                        )}
                        {items.title.length > 30
                          ? `${items.title.slice(0, 30)}...`
                          : items.title}
                        {/* <span>{inquiry.title}</span> */}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {items.representativeName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {items.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-2 px-4 border-b">{items.viewCount}</td>
                    {items.answered ? (
                      <td className="py-2 px-4 text-primary border-b">
                        답변 완료
                      </td>
                    ) : (
                      <td className="py-2 px-4 text-warning border-b">
                        답변 대기
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              activePage={activePage} //현재 페이지
              itemsCountPerPage={itemsCountPerPage} // 페이지 당 항목 수(10개)
              totalItemsCount={qnaData.length} // 표시할 항목의 총 개수(전체)
              pageRangeDisplayed={5} //페이지네이터의 페이지 범위
              hideFirstLastPages={true}
              prevPageText="<"
              // firstPageText="≪"
              nextPageText=">"
              // lastPageText="≫"
              onChange={handlePageChange}
              innerClass="flex justify-center mt-4"
              activeClass="text-white bg-primary rounded-full"
              activeLinkClass="!text-white hover:!text-white" // 활성화된 페이지 스타일 ( 숫자 부분)
              itemClass="group inline-block px-4 py-2 border rounded-full text-gray4 mt-4 mx-0.5 hover:text-primary hover:border-primary" // 페이지 번호 스타일
              linkClass="group-hover:text-primary text-gray4" // 링크의 기본 스타일
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigateTo(routes.qnaRegist)}
                type="submit"
                className="mb-4 px-12 py-3 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
              >
                질문 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Qna;

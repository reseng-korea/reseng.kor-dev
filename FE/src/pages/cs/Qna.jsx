import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import useModal from '../../hooks/useModal';

import qnaIsSecret from '../../assets/qna_isSecret.png';
import Pagination from 'react-js-pagination';

const Qna = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, openModalWithInput, closeModal, RenderModal } = useModal();

  const [qnaData, setQnaData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  // const [activePage, setActivePage] = useState(1);
  const itemsCountPerPage = 10;

  // 게시 작성 날짜 포맷
  const formatCreatedAt = (createdAt) => {
    const [date, time] = createdAt.split('T');
    return `${date} ${time.slice(0, 8)}`;
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = parseInt(searchParams.get('page')) || 1;

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber }); // 페이지 번호를 URL 쿼리 파라미터에 설정
  };

  sessionStorage.setItem('isFromNavigation', 'true');

  // detail 페이지로 데이터 보내는 함수
  const handleResponse = (data, index) => {
    const {
      questionId,
      userId,
      title,
      content,
      representativeName,
      createdAt,
      viewCount,
      secret,
      password,
      answered,
    } = data;

    const {
      answerId: answerId = '',
      content: answerContent = '',
      createdAt: answerCreatedAt = '',
      updatedAt: answerUpdatedAt = '',
    } = data.answer || {};

    navigateTo(routes.qnaDetail.replace(':pageNumber', index), {
      activePage,
      questionId,
      userId,
      title,
      content,
      representativeName,
      createdAt: createdAt ? formatCreatedAt(createdAt) : '',
      viewCount,
      secret,
      password,
      answered,
      answerId,
      answerContent,
      answerCreatedAt: answerCreatedAt ? formatCreatedAt(answerCreatedAt) : '',
      answerUpdatedAt: answerUpdatedAt ? formatCreatedAt(answerUpdatedAt) : '',
      isFromNavigation: true, //페이지 이동 표시
    });
  };

  const handleRowClick = async (index, id, isSecret) => {
    // 관리자라면
    if (role === 'ROLE_MANAGER') {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/qna/questions/${id}`,
          {
            headers: {
              Authorization: accesstoken,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('조회수 - 게시물 들어갈 때 ');

        // 데이터 처리
        if (response.data.code == 200) {
          handleResponse(response.data.data, index);
        }
      } catch (error) {
        console.log(error);
      }
      // 관리자가 아니라면
    } else {
      // 비밀글일 때
      if (isSecret) {
        openModalWithInput({
          primaryText: '비밀글 기능으로 보호된 글입니다.',
          context: '작성자와 관리자만 열람하실 수 있습니다.',
          subContext: '본인이라면 비밀번호를 입력해주세요.',
          inputPlaceholder: '비밀번호 숫자 4자리',
          type: 'warning',
          onConfirm: async (password) => {
            console.log('입력된 비밀번호:', password);
            try {
              const response = await axios.get(
                `${apiUrl}/api/v1/qna/questions/${id}?password=${password}`,
                {
                  headers: {
                    Authorization: accesstoken,
                    'Content-Type': 'application/json',
                  },
                }
              );
              console.log(response);
              if (response.data.code == 200) {
                handleResponse(response.data.data, index);
              }
            } catch (error) {
              console.log(error);
              console.log(error.response.data.code);
              if (error.response.data.code == 4026) {
                openModal({
                  primaryText: '비밀번호가 틀립니다.',
                  context: '확인 후 다시 입력해주세요.',
                  type: 'warning',
                  isAutoClose: false,
                  onConfirm: () => {
                    closeModal();
                  },
                });
              } else {
                // error.response.data.code == 4011
                openModal({
                  primaryText: '해당 글은 작성자와 관리자만',
                  secondaryText: '열람 가능합니다.',
                  type: 'warning',
                  isAutoClose: false,
                  onConfirm: () => {
                    closeModal();
                  },
                });
              }
            }
          },
          onCancel: () => {
            closeModal();
          },
        });
        // 비밀글이 아닐 때
      } else {
        try {
          const response = await axios.get(
            `${apiUrl}/api/v1/qna/questions/${id}`
          );
          console.log(response);

          if (response.data.code == 200) {
            handleResponse(response.data.data, index);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/qna/questions?page=${activePage - 1}&size=${itemsCountPerPage}`
        );

        console.log(response);

        setTotalElements(response.data.data.totalElements);
        const startingIndex =
          totalElements - (activePage - 1) * itemsCountPerPage;

        const sortedData = response.data.data.content
          .map((item) => ({
            id: item.questionId,
            secret: item.secret,
            title: item.title,
            representativeName: item.representativeName,
            createdAt: item.createdAt,
            viewCount: item.viewCount,
            answered: item.answered,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setQnaData(sortedData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [activePage]);

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
                  <th className="w-1/12 py-4 px-4 rounded-l-lg">번호</th>
                  <th className="w-4/12 py-4 px-4 w-1/8">제목</th>
                  <th className="w-2/12 py-4 px-4">작성자</th>
                  <th className="w-2/12 py-4 px-4">등록일</th>
                  <th className="w-1/12 py-4 px-4">조회수</th>
                  <th className="w-3/12 py-4 px-4 rounded-r-lg">답변 상태</th>
                </tr>
              </thead>
              <tbody>
                {qnaData.map((items, index) => (
                  <tr
                    key={items.id}
                    className="border-b hover:bg-placeHolder"
                    onClick={() =>
                      handleRowClick(
                        totalElements -
                          index -
                          (activePage - 1) * itemsCountPerPage,
                        items.id,
                        items.secret
                      )
                    }
                  >
                    <td className="py-5 px-4 border-b">
                      {totalElements -
                        index -
                        (activePage - 1) * itemsCountPerPage}
                    </td>
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
                        {items.title.length > 20
                          ? `${items.title.slice(0, 20)}...`
                          : items.title}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {items.representativeName}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {items.createdAt.slice(0, 10)}
                    </td>
                    <td className="py-2 px-4 border-b">{items.viewCount}</td>
                    <td
                      className={`py-2 px-4 border-b ${items.answered ? 'text-primary' : 'text-warning'}`}
                    >
                      {items.answered ? '답변 완료' : '답변 대기'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              activePage={activePage} //현재 페이지
              itemsCountPerPage={itemsCountPerPage} // 페이지 당 항목 수(10개)
              totalItemsCount={totalElements} // 표시할 항목의 총 개수(전체)
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
      <RenderModal />
    </Layout>
  );
};

export default Qna;

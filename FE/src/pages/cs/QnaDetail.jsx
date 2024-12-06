import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import useModal from '../../hooks/useModal';
import usePreventRefresh from '../../hooks/usePreventRefresh';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { formatCreatedAt } from '../../utils/dateUtils';

import QnaContent from './components/QnaContent';
import QnaAnswer from './components/QnaAnswer';
import QnaAnswerManager from './components/QnaAnswerManager';

const QnaDetail = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const localUserId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  const { navigateTo, routes } = useNavigateTo();
  const { openModal, closeModal, RenderModal } = useModal();
  const [modalOpen, setModalOpen] = useState(false);
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const location = useLocation();
  const initialData = location.state || {};
  const [qnaData, setQnaData] = useState(initialData);
  const [visitCount, setVisitCount] = useState(0); // 방문 횟수 관리

  console.log(initialData);
  console.log(qnaData);

  // 방문 횟수 증가
  // useEffect(() => {
  //   setVisitCount((prevCount) => prevCount + 1); // 초기 로드 시 1로 설정
  // }, []);

  // // 새로고침
  // useEffect(() => {
  //   if (visitCount === 1) {
  //     // 첫 번째 방문 (페이지 이동)
  //     console.log('페이지 이동으로 접근');
  //   } else if (visitCount > 1) {
  //     // 방문 횟수가 2 이상인 경우 (새로고침)
  //     console.log('새로고침으로 접근');
  //     updateQnaData(); // 새로고침 시 API 호출
  //   }
  // }, [visitCount]);

  useEffect(() => {
    let isFromNavigation = sessionStorage.getItem('isFromNavigation');
    if (isFromNavigation === 'false') {
      console.log('새로고침 시 들어와야돼');
      updateQnaData();
    } else {
      console.log('처음에만 들어와');
      isFromNavigation = 'false';
      sessionStorage.setItem('isFromNavigation', isFromNavigation);
    }
  }, []);

  // 댓글 등록 후 API를 다시 호출하여 qnaData를 업데이트하는 함수
  const updateQnaData = async () => {
    try {
      const response = await apiClient.get(
        `${apiUrl}/api/v1/qna/questions/${qnaData.questionId}`,
        {
          headers: {
            Authorization: accesstoken,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('api 재 호출 - QnaDetail', response);
      if (response.data.code == 200) {
        const { answer, ...qnaDetails } = response.data.data;
        setQnaData({
          ...qnaDetails,
          createdAt: qnaDetails.createdAt
            ? formatCreatedAt(qnaDetails.createdAt)
            : '',
          answerId: answer ? answer.answerId : '',
          answerContent: answer ? answer.content : '',
          answerCreatedAt: answer ? formatCreatedAt(answer.createdAt) : '',
          answerUpdatedAt: answer ? formatCreatedAt(answer.updatedAt) : '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
          <div
            className="flex flex-col gap-x-6 items-center slide-up mb-12"
            // style={{ height: 'calc(100vh - 230px)' }}
          >
            {/* 문의 내용 */}
            <QnaContent qnaData={qnaData} setQnaData={setQnaData} />
            {/* 관리자인지 아닌지에 따른 답변 페이지 */}
            <div className="flex flex-col w-4/5">
              <div className="flex flex-col w-full justify-center mt-4">
                <span className="mb-4 font-bold text-left text-lg">
                  답변 등록
                </span>
                {role === 'ROLE_MANAGER' ? (
                  <QnaAnswerManager qnaData={qnaData} setQnaData={setQnaData} />
                ) : (
                  <QnaAnswer {...qnaData} />
                )}
              </div>
              <hr className="w-full mt-12 mb-12 border-t border-gray2" />
            </div>

            {/* 목록 */}
            <div className="flex w-full justify-center mt-4">
              <button
                onClick={() =>
                  navigateTo(`${routes.qna}?page=${initialData.activePage}`)
                }
                type="submit"
                className="px-8 py-2 font-bold border border-primary transition-colors duration-300 rounded-3xl hover:bg-white hover:text-primary"
              >
                목록
              </button>
              {/* <button
                onClick={() =>
                  navigateTo(`${routes.qna}?page=${initialData.activePage}`)
                }
                className="w-1/6 px-4 py-3 justify-center font-bold text-white transition-colors duration-300 bg-primary hover:bg-hover text-xs sm:text-sm md:text-md rounded-lg"
              >
                목록
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default QnaDetail;

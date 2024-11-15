import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import useModal from '../../hooks/useModal';
import usePreventRefresh from '../../hooks/usePreventRefresh';
import { useNavigateTo } from '../../hooks/useNavigateTo';

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

  // const {
  //   activePage, //현재 페이지
  //   questionId, //글 번호
  //   userId, //유저 번호
  //   title, //제목
  //   content, //내용
  //   representativeName, //등록자
  //   createdAt, //문의 날짜
  //   viewCount, //조회수
  //   secret, //비밀글 여부
  //   password, //비밀번호
  //   answered, //답글 등록 여부
  //   answerContent,
  //   answerCreatedAt,
  // } = location.state || {};
  const location = useLocation();
  const initialData = location.state || {};
  const [qnaData, setQnaData] = useState(initialData);

  console.log(initialData);
  console.log('날짜요', qnaData);

  // 게시 작성 날짜 포맷
  const formatCreatedAt = (createdAt) => {
    const [date, time] = createdAt.split('T');
    return `${date} ${time.slice(0, 8)}`;
  };

  // 새로고침
  // useEffect(() => {
  //   console.log(qnaData);
  //   if (!qnaData || !qnaData.questionId) {
  //     fetchQnaData();
  //   }
  // }, []);

  console.log('데이터', qnaData);

  // 댓글 등록 후 API를 다시 호출하여 qnaData를 업데이트하는 함수
  const fetchQnaData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/qna/questions/${qnaData.questionId}?password=${qnaData.password}`,
        {
          headers: {
            Authorization: accesstoken,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('댓글 등록 후 호출', response);
      if (response.data.code === 200) {
        const { answer, ...qnaDetails } = response.data.data;
        setQnaData({
          ...qnaDetails,
          createdAt: qnaDetails.createdAt
            ? formatCreatedAt(qnaDetails.createdAt)
            : '',
          answerId: answer ? answer.answerId : '',
          answerContent: answer ? answer.content : '', // answer가 있으면 content 가져오기
          answerCreatedAt: answer ? formatCreatedAt(answer.createdAt) : '', // answer가 있으면 createdAt 가져오기
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
            className="flex flex-col gap-x-6 items-center slide-up"
            // style={{ height: 'calc(100vh - 230px)' }}
          >
            {/* 문의 내용 */}
            <QnaContent {...qnaData} />
            <div className="flex flex-col w-4/5">
              <div className="flex flex-col w-full justify-center mt-4">
                <span className="mb-4 font-bold text-left text-lg">
                  답변 등록
                </span>
                {/* <QnaAnswerManager {...qnaData} /> */}
                {role === 'ROLE_MANAGER' ? (
                  <QnaAnswerManager {...qnaData} />
                ) : (
                  <QnaAnswer {...qnaData} />
                )}
                <>{/* 여기에 답변 */}</>
              </div>
              <hr className="w-full mt-12 mb-12 border-t border-gray2" />
            </div>

            {/* 목록 */}
            <div className="flex w-full justify-center mt-4">
              <button
                onClick={() =>
                  navigateTo(`${routes.qna}?page=${initialData.activePage}`)
                }
                className="w-1/6 px-4 py-3 justify-center font-bold text-white transition-colors duration-300 bg-primary hover:bg-hover text-xs sm:text-sm md:text-md rounded-lg"
              >
                목록
              </button>
            </div>
          </div>
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default QnaDetail;

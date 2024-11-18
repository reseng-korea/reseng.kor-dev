import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useModal from '../../../hooks/useModal';
import usePreventRefresh from '../../../hooks/usePreventRefresh';
import { useNavigateTo } from '../../../hooks/useNavigateTo';

const QnaAnswerManager = ({ qnaData, setQnaData }) => {
  //   userId, questionId, title, content, representativeName, viewCount, createdAt, secret,
  //   password, answered, answerId, answerContent, answerCreatedAt, answerUpdatedAt,
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');

  const { navigateTo, routes } = useNavigateTo();
  const { openModal, closeModal, RenderModal } = useModal();
  const [modalOpen, setModalOpen] = useState(false);
  usePreventRefresh(openModal, closeModal, setModalOpen);

  // const [qnaData, setQnaData] = useState(qnaDatas);
  console.log(qnaData);

  const [answerContentInput, setAnswerContentInput] = useState('');
  const [isModify, setIsModify] = useState(false);

  // 게시 작성 날짜 포맷
  const formatCreatedAt = (createdAt) => {
    const [date, time] = createdAt.split('T');
    return `${date} ${time.slice(0, 8)}`;
  };

  const handleAnswerInputContent = (e) => {
    setAnswerContentInput(e.target.value);
  };

  // 답변 등록 버튼 클릭 시
  const handleSubmit = async () => {
    console.log('답변', answerContentInput);
    console.log('질문아이디', qnaData.questionId);
    // 수정된 답변 등록이라면
    if (isModify) {
      try {
        const response = await axios.put(
          `${apiUrl}/api/v1/qna/answers/${qnaData.answerId}`,
          {
            content: answerContentInput,
            questionId: qnaData.questionId,
          },
          {
            headers: {
              Authorization: accesstoken,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);

        console.log('조회수 - 수정될 때 호출');

        if (response.data.code == 201) {
          openModal({
            primaryText: '답변이 수정되었습니다.',
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal();
              fetchQnaData();
            },
          });
        }
      } catch (error) {
        console.log(error);
        openModal({
          primaryText: '답변 수정에 실패했습니다.',
          context: '잠시 후 다시 시도해주세요.',
          type: 'warning',
          isAutoClose: true,
          onConfirm: () => {
            closeModal();
            fetchQnaData();
          },
        });
      }
      setIsModify(false);
      setQnaData((prevData) => ({
        ...prevData, // 기존 qnaData의 내용을 복사
        answered: false, // answered 값을 true로 변경
      }));
      // 처음 답변 등록이라면
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/qna/answers`,
          {
            content: answerContentInput,
            questionId: qnaData.questionId,
          },
          {
            headers: {
              Authorization: accesstoken,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);
        console.log('조회수 - 처음 답변 시 호출');

        if (response.data.code == 201) {
          openModal({
            primaryText: '답변이 등록되었습니다.',
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal();
              fetchQnaData();
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 새로고침 시 사라짐 방지
  useEffect(() => {
    console.log(qnaData);
    if (!qnaData || !qnaData.questionId) {
      fetchQnaData();
    }
  }, []);

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
      console.log('조회수 - 댓글 등록 후');
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

  // 댓글 수정
  const handleModifyComment = async () => {
    setQnaData((prevData) => ({
      ...prevData,
      answered: false,
    }));
    setAnswerContentInput(qnaData.answerContent);
    setIsModify(true); //수정임을 알리기
  };

  // 댓글 삭제
  const handleDeleteComment = async () => {
    openModal({
      primaryText: '답변을 삭제하시겠습니까?',
      context: '삭제된 답변은 복구할 수 없습니다.',
      type: 'warning',
      isAutoClose: false,
      cancleButton: true,
      buttonName: '취소',
      cancleButtonName: '삭제',
      onConfirm: () => closeModal(),
      onCancel: async () => {
        try {
          closeModal();
          const response = await axios.delete(
            `${apiUrl}/api/v1/qna/answers/${qnaData.answerId}`,
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(response);
          console.log('조회수 - 댓글 삭제');

          if (response.data.code == 201) {
            openModal({
              primaryText: '삭제가 완료되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                closeModal();
                fetchQnaData();
              },
            });
          }
        } catch (error) {
          console.log(error);
          openModal({
            primaryText: '답변 삭제에 실패했습니다.',
            context: '잠시 후 다시 시도해주세요.',
            type: 'warning',
            isAutoClose: true,
            onConfirm: () => {
              closeModal();
              fetchQnaData();
            },
          });
        }
      },
    });
  };

  return (
    <>
      {qnaData.answered ? (
        <>
          {/* // 답변이 달렸을 때 */}
          <div className="flex flex-col w-full px-4 py-6 bg-placeHolder rounded-lg">
            <div className="flex items-center space-x-2 m-4">
              <span className="text-md text-gray4">관리자</span>
              <span className="text-sm text-gray3">
                {qnaData.answerCreatedAt}
              </span>
            </div>
            <div className="flex items-start m-4 mb-6">
              <span className="text-md text-left">{qnaData.answerContent}</span>
            </div>
          </div>
          <div className="flex space-x-2 justify-end items-end mt-2">
            <button
              onClick={handleModifyComment}
              className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-primary hover:text-primary"
            >
              수정
            </button>
            <button
              onClick={handleDeleteComment}
              className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-warning hover:text-warning"
            >
              삭제
            </button>
          </div>
        </>
      ) : (
        // 답변을 해야할 때(관리자만 보이는 답변 기능)
        <>
          <div className="flex flex-col w-full px-4 py-4 bg-placeHolder rounded-lg">
            <textarea
              value={answerContentInput}
              onChange={handleAnswerInputContent}
              className="w-full p-2 mb-2 border rounded-lg resize-none"
              style={{ height: '8rem' }}
              placeholder="내용을 입력해주세요"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-3 font-bold text-white transition-colors duration-300 bg-primary hover:bg-hover text-xs sm:text-sm md:text-md rounded-lg"
              >
                답변 등록
              </button>
            </div>
          </div>
        </>
      )}
      <RenderModal />
    </>
  );
};

export default QnaAnswerManager;

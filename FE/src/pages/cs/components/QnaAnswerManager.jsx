import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useModal from '../../../hooks/useModal';

const QnaAnswerManager = ({ qnaData, setQnaData }) => {
  //   userId, questionId, title, content, representativeName, viewCount, createdAt, secret,
  //   password, answered, answerId, answerContent, answerCreatedAt, answerUpdatedAt,
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');

  const { openModal, closeModal, RenderModal } = useModal();

  const [answerContentInput, setAnswerContentInput] = useState('');
  const [isModify, setIsModify] = useState(false);

  // 게시 작성 날짜 포맷
  const formatCreatedAt = (createdAt) => {
    const [date, time] = createdAt.split('T');
    return `${date} ${time.slice(0, 8)}`;
  };

  // 답변 등록 핸들러
  const handleAnswerInputContent = (e) => {
    setAnswerContentInput(e.target.value);
  };

  // 답변 등록 버튼 클릭 시
  const handleSubmit = async () => {
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

        if (response.data.code == 201) {
          openModal({
            primaryText: '답변이 수정되었습니다.',
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal();
              updateQnaData();
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
            // updateQnaData();
          },
        });
      }
      setIsModify(false);
      setQnaData((prevData) => ({
        ...prevData, // 기존 qnaData의 내용을 복사
        answered: true, // answered 값을 true로 변경
      }));

      // 처음 답변을 등록하는 거라면
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

        if (response.data.code == 201) {
          // 답변 등록 변수인 answered를 true로 바꾸기
          const updatedQnaData = {
            ...qnaData, // 기존 데이터를 유지
            answered: true, // answered만 업데이트
          };
          setQnaData(updatedQnaData);
          openModal({
            primaryText: '답변이 등록되었습니다.',
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal();
              updateQnaData();
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 댓글 등록 후 API를 다시 호출하여 qnaData를 업데이트하는 함수
  const updateQnaData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/qna/questions/${qnaData.questionId}`,
        {
          headers: {
            Authorization: accesstoken,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.code === 200) {
        const { answer, ...qnaDetails } = response.data.data;
        setQnaData({
          ...qnaDetails,
          answerId: answer ? answer.answerId : '',
          answerContent: answer ? answer.content : '',
          answerCreatedAt: answer ? formatCreatedAt(answer.createdAt) : '',
          answerUpdatedAt: answer ? formatCreatedAt(answer.updatedAt) : '',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 답변 수정 버튼 클릭 시
  const handleModifyComment = async () => {
    setQnaData((prevData) => ({
      ...prevData,
      answered: false,
    }));
    setAnswerContentInput(qnaData.answerContent); //답변 가져오기
    setIsModify(true); //수정임을 알리기
  };

  // 답변 삭제 버튼 클릭 시
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

          if (response.data.code == 201) {
            openModal({
              primaryText: '삭제가 완료되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                closeModal();
                updateQnaData();
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
              // updateQnaData();
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

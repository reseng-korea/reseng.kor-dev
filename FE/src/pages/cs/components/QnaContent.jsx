import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigateTo } from '../../../hooks/useNavigateTo';
import useModal from '../../../hooks/useModal';

import { IoPersonSharp } from 'react-icons/io5';
import { IoTimeOutline } from 'react-icons/io5';
import { IoEye } from 'react-icons/io5';

const QnaContent = (
  { qnaData, setQnaData }
  //   userId, questionId, title, content, representativeName, viewCount, createdAt, secret,
  //   password, answered, answerId, answerContent, answerCreatedAt, answerUpdatedAt,
) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const localUserId = localStorage.getItem('userId');

  const { navigateTo, routes } = useNavigateTo();
  const { openModal, closeModal, RenderModal } = useModal();
  const [modalOpen, setModalOpen] = useState(false);

  // 1:1 문의 글 수정 버튼 클릭 시
  const handleModifyPost = () => {
    navigateTo(routes.qnaRegist, {
      data: {
        isModify: true,
        ...qnaData,
        password: qnaData.password,
      },
    });
  };

  // 1:1 문의 글 삭제 버튼 클릭 시
  const handleDeletePost = () => {
    openModal({
      primaryText: '이 글을 삭제하시겠습니까?',
      context: '삭제된 글은 복구할 수 없습니다.',
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
            `${apiUrl}/api/v1/qna/questions/${qnaData.questionId}`,
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(response);
          if (response.data.code == 201) {
            openModal({
              primaryText: '삭제가 완료되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                navigateTo(routes.qna);
                closeModal();
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return (
    <div className="flex flex-col flex-grow w-4/5 mb-4">
      <div className="flex flex-col">
        <span className="w-full mb-6 text-left text-3xl font-bold">
          {qnaData.title}
        </span>
        <div className="flex space-x-3">
          <div className="flex space-x-2">
            <IoPersonSharp className="w-5 h-5 text-gray3 flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm md:text-md">
              {qnaData.representativeName}
            </span>
          </div>
          <div className="flex space-x-2">
            <IoEye className="w-6 h-6 text-gray3 flex-shrink-0" />
            <span className="truncate text-xs text-gray3 sm:text-sm md:text-md">
              {qnaData.viewCount}
            </span>
          </div>
          <div className="flex space-x-2">
            <IoTimeOutline className="w-6 h-6 text-gray3 flex-shrink-0" />
            <span className="truncate text-xs text-gray3 sm:text-sm md:text-md">
              {qnaData.createdAt}
            </span>
          </div>
        </div>
      </div>
      <hr className="w-full mt-1 border-t border-gray2" />
      <div className="flex justify-start mt-12 min-h-[40vh]">
        {/* <div className="flex justify-start p-12 bg-primary"> */}
        <span className="text-left text-xs sm:text-sm md:text-md">
          {qnaData.content}
        </span>
      </div>
      <hr className="w-full mt-12 border-t border-gray2" />
      {qnaData.userId == localUserId && (
        <div className="flex space-x-2 justify-end items-end mt-2">
          <button
            onClick={handleModifyPost}
            className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-primary hover:text-primary"
          >
            수정
          </button>
          <button
            onClick={handleDeletePost}
            className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-warning hover:text-warning"
          >
            삭제
          </button>
        </div>
      )}
      <RenderModal />
    </div>
  );
};

export default QnaContent;

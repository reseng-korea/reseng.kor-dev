// 임시페이지임 삭제 예정
import React, { useState, useEffect, useRef } from 'react';
import { useNavigateTo } from '../hooks/useNavigateTo';
import axios from 'axios';
import useModal from '../hooks/useModal';

const Tmp = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();
  const { openModal, closeModal, RenderModal } = useModal();

  return (
    <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
      <div className="w-full flex flex-col mb-1 space-x-2">
        <button onClick={() => navigateTo(routes.itemsBanner)}>
          아이템 페이지
        </button>
        <button onClick={refreshAccessToken}>아이템 페이지</button>
      </div>
      <RenderModal />
    </div>
  );
};
export default Tmp;

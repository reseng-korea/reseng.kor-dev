// 임시페이지임 삭제 예정
import React, { useState, useEffect, useRef } from 'react';
import { useNavigateTo } from '../hooks/useNavigateTo';
import axios from 'axios';
import useModal from '../hooks/useModal';

const Tmp = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();
  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const handleLogout = async () => {
    const accesstoken = localStorage.getItem('accessToken');
    console.log(accesstoken);
    const refreshToken = localStorage.getItem('refreshToken');
    console.log(refreshToken);

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/logout`,
        {},
        {
          headers: {
            Refresh: refreshToken,
          },
        }
      );

      if (response.data.code == 200) {
        setModalOpen(true);
        openModal({
          primaryText: '로그아웃되었습니다.',
          context: '이용해 주셔서 감사합니다.',
          type: 'warning',
          isAutoClose: false,
          onConfirm: () => {
            navigateTo(routes.home);
            closeModal(), setModalOpen(false);
          },
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
      <div className="w-full flex flex-col mb-1 space-x-2">
        <button onClick={() => navigateTo(routes.socialinfo)}>
          간편 로그인 시 추가정보 입력 페이지
        </button>
        <button onClick={() => navigateTo(routes.idinquirySuccess)}>
          아이디 찾기 성공 페이지
        </button>
        <button onClick={() => navigateTo(routes.idinquiryFailure)}>
          아이디 찾기 실패 페이지
        </button>
        <button onClick={() => navigateTo(routes.pwinquiryNew)}>
          비밀번호 변경 페이지
        </button>
        <button onClick={() => navigateTo(routes.itemsBanner)}>
          아이템 페이지
        </button>
        <button onClick={() => navigateTo(routes.mypageMember)}>
          마이페이지
        </button>
        <button onClick={() => navigateTo(routes.mypageWithdraw)}>
          탈퇴페이지
        </button>
        <button onClick={() => navigateTo(routes.qnaDetail)}>
          1:1 문의 상세 페이지
        </button>
        <button onClick={() => navigateTo(routes.qrSuccess)}>qr 성공</button>
        <button onClick={() => navigateTo(routes.qrFailure)}>qr 실패</button>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
      {modalOpen && <RenderModal />}
    </div>
  );
};
export default Tmp;

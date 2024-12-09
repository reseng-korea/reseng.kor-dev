import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import useModal from '../../hooks/useModal';
import usePreventRefresh from '../../hooks/usePreventRefresh';

const FindIdPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 필터링
    const filteredValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(filteredValue);
  };

  const handleSubmit = async () => {
    if (!companyName) {
      setModalOpen(true);
      openModal({
        primaryText: '업체명을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!phoneNumber) {
      setModalOpen(true);
      openModal({
        primaryText: '휴대폰 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (phoneNumber.length != 11) {
      setModalOpen(true);
      openModal({
        primaryText: '올바른 휴대폰 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/find-email`,
          { companyName: companyName, phoneNumber: phoneNumber },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        // console.log(response.data.data.email);

        // 성공했을 때
        if (response.status == 200) {
          const email = response.data.data.email;

          navigateTo(routes.idinquirySuccess, {
            email,
          });
        }
      } catch (error) {
        navigateTo(routes.idinquiryFailure);
      }
    }
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [modalOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen slide-up">
      <div className="w-full max-w-lg p-8">
        <h1 className="pt-16 mb-6 text-2xl font-bold">아이디 찾기</h1>
        <hr className="w-full mb-6 border-t-2 border-primary" />

        {/* 업체명 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">업체명</label>
          <input
            type="text"
            value={companyName}
            onChange={handleCompanyNameChange}
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="업체명을 입력해주세요"
          />
          {!companyName && (
            <span className="self-start text-xs text-warning">
              가입 시 등록한 업체명을 입력해주세요.
            </span>
          )}
        </div>

        {/* 휴대폰 번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">휴대폰 번호</label>
          <input
            type="tel"
            maxLength="11"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="숫자만 입력해주세요"
          />
          {!phoneNumber && (
            <span className="self-start text-xs text-warning">
              가입 시 등록한 휴대폰번호를 입력해주세요.
            </span>
          )}
        </div>

        {/* 아이디 찾기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-hover"
          >
            아이디 찾기
          </button>
        </div>

        {/* 아이디, 비번 찾기 */}
        <div className="flex items-center justify-between px-3">
          <span
            onClick={() => navigateTo(routes.pwinquiry)}
            className="text-sm cursor-pointer hover:text-gray3"
          >
            비밀번호 찾기
          </span>
          <span
            onClick={() => navigateTo(routes.signin)}
            className="text-sm cursor-pointer hover:text-gray3"
          >
            로그인
          </span>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </div>
  );
};

export default FindIdPage;

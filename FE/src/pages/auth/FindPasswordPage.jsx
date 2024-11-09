import React, { useState } from 'react';
import axios from 'axios';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import useModal from '../../hooks/useModal';

const FindPasswordPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // 간단한 이메일 유효성 검사 (형식 체크)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(value));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력 가능하도록 필터링
    const filteredValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(filteredValue);
  };

  const handleSubmit = async () => {
    if (!email) {
      setModalOpen(true);
      openModal({
        title: '이메일을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!phoneNumber) {
      setModalOpen(true);
      openModal({
        title: '휴대폰 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (phoneNumber.length != 11) {
      setModalOpen(true);
      openModal({
        title: '올바른 휴대폰 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/find-password`,
          { email: email, phoneNumber: phoneNumber },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);

        // 성공했을 때
        setModalOpen(true);
        openModal({
          // title: `${response.data} (으)로 임시 비밀번호가 전송되었습니다.`,
          title: `010-1111-1111(으)로 임시 비밀번호가 전송되었습니다.`,
          type: 'success',
          isAutoClose: false,
          onConfirm: () => {
            closeModal(), setModalOpen(false);
            navigateTo(routes.signin);
          },
        });
      } catch (error) {
        console.log(error);
        setModalOpen(true);
        openModal({
          title: '입력하신 정보와 일치하는 계정을 찾을 수 없습니다.',
          context: '다시 확인해주세요.',
          type: 'warning',
          isAutoClose: false,
          onConfirm: () => {
            closeModal(), setModalOpen(false);
          },
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen slide-up">
      <div className="w-full max-w-lg p-8">
        <h1 className="pt-16 mb-6 text-2xl font-bold">비밀번호 찾기</h1>
        <hr className="w-full mb-6 border-t-2 border-primary" />

        {/* 이메일 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">이메일</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={`w-full p-2 mb-1 border rounded-lg ${isValid ? '' : 'border-warning'}`}
            placeholder="이메일을 입력해주세요"
          />
          {email === '' ? (
            <span className="self-start text-xs text-warning">
              가입 시 등록한 이메일을 입력해주세요.
            </span>
          ) : (
            !isValid && (
              <span className="self-start text-xs text-warning">
                유효한 이메일 주소를 입력해주세요.
              </span>
            )
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

        {/* 비밀번호 찾기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-hover"
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 아이디 찾기, 로그인 버튼 */}
        <div className="flex items-center justify-between px-3">
          <span
            onClick={() => navigateTo(routes.idinquiry)}
            className="text-sm cursor-pointer hover:text-gray3"
          >
            아이디 찾기
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

export default FindPasswordPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import CustomModal from '../../../components/CustomModal';

Modal.setAppElement('#root'); // 접근성 설정 (필수)

const PhoneNumberInfoForm = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 전화번호
  const [phoneNumber, setPhoneNumber] = useState('');
  // 인증 요청 누름 상태 버튼
  const [isClicked, setIsClicked] = useState(false);
  // 모달 상태 및 메시지 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [autoCloseMessage, setAutoCloseMessage] = useState('');
  const [type, setType] = useState('');

  // 휴대폰번호 인증 번호
  const [authCode, setAuthCode] = useState('');
  // 인증 시간(3분)
  const [timeLeft, setTimeLeft] = useState(180);

  const openModal = (title, message, type) => {
    setModalTitle(title);
    setAutoCloseMessage(message);
    setType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handlePhoneNumberInputChange = (e) => {
    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''));
    console.log(phoneNumber);
  };

  const handlePhoneNumberCheckClick = async () => {
    console.log(phoneNumber);
    if (!phoneNumber) {
      console.log('입력');
      openModal(
        '휴대폰번호를 입력해주세요.',
        '(5초 뒤 창이 사라집니다.)',
        'warning'
      );
    } else {
      setIsClicked(true);
      openModal(
        `${phoneNumber} (으)로 인증번호가 발송되었습니다.`,
        '(5초 뒤 창이 사라집니다.)',
        'success'
      );
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/sms/send-verification`,
          { to: phoneNumber },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.log('오류');
      }
    }
  };

  // 인증번호 입력 감지
  const handleAuthInputChange = (e) => {
    setAuthCode(e.target.value);
  };

  const handlePhoneNumberAuthClick = async () => {};

  // 타이머 로직
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  // 남은 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
  };

  return (
    <>
      {/* 휴대폰 번호 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">휴대폰 번호</label>
        <div className="flex items-center justify-center w-full mb-1 space-x-2">
          <input
            type="tel"
            pattern="[0-9\]+"
            maxLength="11"
            value={phoneNumber}
            onChange={handlePhoneNumberInputChange}
            className="flex-grow p-2 mb-1 border rounded-lg"
            placeholder="숫자만 입력해주세요"
          />
          <button
            type="submit"
            onClick={handlePhoneNumberCheckClick}
            className={`flex-grow-0 px-4 py-2 mb-2 font-bold transition-colors duration-300 rounded-lg  ${isClicked ? 'bg-transition text-gray3 border border-gray3 hover:text-gray4 hover:border-gray4' : 'text-white bg-primary hover:bg-hover'}`}
          >
            {isClicked ? '재전송' : '인증 요청'}
          </button>
        </div>

        {isClicked && (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-center w-full mb-1 space-x-2">
              <input
                type="text"
                value={authCode}
                className="flex-grow p-2 border rounded-lg"
                placeholder="인증번호 6자리를 입력해주세요"
                onChange={handleAuthInputChange}
              />
              <span className="text-gray-600 font-bold justify-center items-center">
                ({formatTime(timeLeft)})
              </span>
              <button
                type="submit"
                onClick={handlePhoneNumberAuthClick}
                className="flex-grow-0 px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
              >
                인증하기
              </button>
            </div>
            <div className="flex mb-2">
              <span className="text-xs text-gray3">
                인증번호를 발송했습니다. (유효시간 3분) dkssud
              </span>
            </div>
          </div>
        )}

        {isModalOpen && (
          <CustomModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            title={modalTitle}
            autoCloseMessage={autoCloseMessage}
            type={type}
          ></CustomModal>
        )}
      </div>
    </>
  );
};

export default PhoneNumberInfoForm;

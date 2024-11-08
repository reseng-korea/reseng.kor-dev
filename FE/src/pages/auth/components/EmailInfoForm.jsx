import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

import CustomModal from '../../../components/CustomModal';

Modal.setAppElement('#root'); // 접근성 설정 (필수)

const EmailInfoForm = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 이메일
  const [email, setEmail] = useState('');
  // 이메일 유효성 상태
  const [isValidEmail, setIsValidEmail] = useState(true);
  // 중복 확인 누름 상태 버튼
  const [isClicked, setIsClicked] = useState(false);
  // 모달 상태 및 메시지 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [type, setType] = useState('');
  // 이메일 인증 번호
  const [authCode, setAuthCode] = useState('');
  // 인증 시간(5분)
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초

  // 인증 완료
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  const [autoCloseMessage, setAutoCloseMessage] =
    useState('(5초 뒤 창이 사라집니다.)');

  // 이메일 입력 감지
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
    console.log(email);

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));

    console.log(isValidEmail);
  };

  // 인증번호 입력 감지
  const handleAuthInputChange = (e) => {
    setAuthCode(e.target.value);
  };

  const openModal = (title, message, type) => {
    setModalTitle(title);
    setAutoCloseMessage(message);
    setType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleEmailCheckClick = async () => {
    if (!email) {
      openModal(
        '이메일을 입력해주세요.',
        '(5초 뒤 창이 사라집니다.)',
        'warning'
      );
    } else if (!isValidEmail) {
      openModal(
        '올바르지 않은 이메일 형식입니다.',
        '(5초 뒤 창이 사라집니다.)',
        'warning'
      );
    } else {
      setIsClicked(true);
      openModal(
        `${email} (으)로 인증번호가 발송되었습니다.`,
        '(5초 뒤 창이 사라집니다.)',
        'success'
      );
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/mail/send-verification`,
          { email: email },
          {
            headers: {
              // Authorization: `Bearer ${accessToken}`, // 실제 토큰 값으로 대체
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          console.log('사용 가능한 이메일입니다.');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          console.error('이미 사용 중인 이메일입니다.');
        } else {
          console.error('이메일 중복 확인에 실패했습니다.', error);
        }
      }
    }
  };

  const handleEmailAuthClick = async () => {
    if (!authCode) {
      openModal(
        '인증번호를 입력해주세요.',
        '(5초 뒤 창이 사라집니다.)',
        'warning'
      );
    } else {
      try {
        console.log(authCode);
        const response = await axios.post(
          `${apiUrl}/api/v1/mail/verify`,
          {
            email: email,
            code: authCode,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        // console.log(response);
        console.log(response.data.code);

        if (response.data.code == 200) {
          openModal(
            '이메일 인증이 성공적으로 완료되었습니다.',
            '(5초 뒤 창이 사라집니다.)',
            'success'
          );
          setIsAuthVerified(true);
        }
      } catch (error) {
        console.log(error);
        if (
          error.response.data.message ==
          '인증 코드가 일치하지 않습니다. 올바른 코드를 입력해 주세요.'
        ) {
          openModal(
            '인증번호가 올바르지 않습니다. 다시 확인해 주세요.',
            '(5초 뒤 창이 사라집니다.)',
            'warning'
          );
        } else {
          openModal(
            '인증번호가 만료되었습니다. 다시 요청하여 새로운 인증번호를 받아주세요.',
            '(5초 뒤 창이 사라집니다.)',
            'warning'
          );
        }
      }
    }
  };

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
      {/* 이메일 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">이메일</label>
        <div className="flex items-center justify-center w-full mb-1 space-x-2">
          <input
            type="email"
            value={email}
            className="flex-grow p-2 mb-1 border rounded-lg"
            placeholder="이메일을 입력해주세요"
            onChange={handleEmailInputChange}
            disabled={isClicked}
          />
          <button
            type="submit"
            onClick={handleEmailCheckClick}
            disabled={isAuthVerified}
            className={`flex-grow-0 px-4 py-2 mb-2 font-bold transition-colors duration-300 rounded-lg
              ${
                isAuthVerified
                  ? 'bg-gray3 text-white'
                  : isClicked
                    ? 'bg-transition text-gray3 border border-gray3 hover:text-gray4 hover:border-gray4'
                    : 'text-white bg-primary hover:bg-hover'
              }`}
          >
            {isAuthVerified ? '인증 완료' : isClicked ? '재전송' : '중복 확인'}
          </button>
        </div>

        {/* 인증 번호 */}
        {isClicked && !isAuthVerified && (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-center w-full mb-1 space-x-2">
              <input
                type="text"
                value={authCode}
                className="flex-grow p-2 border rounded-lg"
                placeholder="인증번호 8자리를 입력해주세요"
                onChange={handleAuthInputChange}
              />
              <span className="text-gray-600 font-bold justify-center items-center">
                ({formatTime(timeLeft)})
              </span>
              <button
                type="submit"
                onClick={handleEmailAuthClick}
                className="flex-grow-0 px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
              >
                인증하기
              </button>
            </div>
            <div className="flex mb-2">
              <span className="text-xs text-gray3">
                인증번호를 발송했습니다. (유효시간 5분)
              </span>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CustomModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          title={modalTitle}
          autoCloseMessage={autoCloseMessage}
          type={type}
        ></CustomModal>
      )}
    </>
  );
};

export default EmailInfoForm;

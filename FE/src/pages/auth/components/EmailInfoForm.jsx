import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import useModal from '../../../hooks/useModal';

import CustomLoadingModal from '../../../components/CustomLoadingModal';

const EmailInfoForm = ({
  email,
  setEmail,
  isValidEmail,
  setIsValidEmail,
  isConfirmEmail,
  setIsConfirmEmail,
  isAuthVerified,
  setIsAuthVerified,
  isClicked,
  setIsClicked,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 중복 확인 누름 상태 버튼
  // const [isClicked, setIsClicked] = useState(false);
  // 이메일 인증 번호
  const [authCode, setAuthCode] = useState('');
  // 타이머 ID 저장
  const timerRef = useRef(null);
  // 인증 시간(5분)
  const [timeLeft, setTimeLeft] = useState(300); // 5분 = 300초

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();
  // 인증 완료
  // const [isAuthVerified, setIsAuthVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // 이메일 입력 감지
  const handleEmailInputChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(newEmail));
  };

  // 인증번호 입력 감지
  const handleAuthInputChange = (e) => {
    setAuthCode(e.target.value);
  };

  // 중복 확인 클릭 시
  const handleEmailCheckClick = async (e) => {
    e.preventDefault();
    if (!email) {
      setModalOpen(true);
      openModal({
        primaryText: '이메일을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isValidEmail) {
      setModalOpen(true);
      openModal({
        primaryText: '올바르지 않은 이메일 형식입니다.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/mail/send-verification`,
          { email: email },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // console.log(response);
        if (response.data.code == 201) {
          setIsLoading(false);
          setModalOpen(true);
          openModal({
            primaryText: `${email} (으)로`,
            secondaryText: ' 인증번호가 발송되었습니다.',
            context: '5분이 지나도 이메일이 오지 않으면 다시 요청해주세요.',
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal();
              setModalOpen(false);
              setIsClicked(true);
              setTimeLeft(300);
              // 기존 타이머 있을 경우 초기화
              if (timerRef.current) clearInterval(timerRef.current);
              timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
              }, 1000);
            },
          });
        }
      } catch (error) {
        setIsLoading(false);
        // console.log(error);
        const code = error.response.data.code;
        if (code == 4022) {
          setModalOpen(true);
          openModal({
            primaryText: '이미 존재하는 이메일입니다.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        } else {
          //code == 4024 비활성화된 이메일
          setModalOpen(true);
          openModal({
            primaryText: '비활성화된 이메일입니다.',
            context: '관리자에게 문의해주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        }
      }
    }
  };

  const handleEmailAuthClick = async () => {
    if (!authCode) {
      setModalOpen(true);
      openModal({
        primaryText: '인증번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
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

        if (response.data.code == 200) {
          setModalOpen(true);
          setIsConfirmEmail(true);
          openModal({
            primaryText: '이메일 인증이 성공적으로 완료되었습니다.',
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
          setIsAuthVerified(true);
          clearInterval(timerRef.current);
          setIsValidEmail(true);
          timerRef.current = null;
        }
      } catch (error) {
        // console.log(error);
        if (
          error.response.data.message ===
          '인증 코드가 일치하지 않습니다. 올바른 코드를 입력해 주세요.'
        ) {
          setModalOpen(true);
          openModal({
            primaryText: '인증번호가 올바르지 않습니다. 다시 확인해 주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        } else {
          setModalOpen(true);
          openModal({
            primaryText: '인증번호가 만료되었습니다.',
            context: '다시 요청하여 새로운 인증번호를 받아주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
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
        <div className="flex self-start space-x-1">
          <label className="mb-2 text-lg">이메일</label>
          <span className="text-warning font-bold text-lg">*</span>
        </div>
        <form className="flex items-center justify-center w-full mb-1 space-x-2">
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
        </form>

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
      <CustomLoadingModal isOpen={isLoading} />
      {modalOpen && <RenderModal />}
    </>
  );
};

export default EmailInfoForm;

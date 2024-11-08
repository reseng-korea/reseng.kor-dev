import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import useModal from '../../../hooks/useModal';

const PhoneNumberInfoForm = ({
  phoneNumber,
  setPhoneNumber,
  isValidPhoneNumber,
  setIsValidPhoneNumber,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 인증 요청 누름 상태 버튼
  const [isClicked, setIsClicked] = useState(false);
  // 휴대폰번호 인증 번호
  const [authCode, setAuthCode] = useState('');
  // 타이머 ID 저장
  const timerRef = useRef(null);
  // 인증 시간(3분)
  const [timeLeft, setTimeLeft] = useState(180);

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();
  // 인증 완료
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  const handlePhoneNumberInputChange = (e) => {
    const newPhoneNumber = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(newPhoneNumber);
  };

  const handlePhoneNumberCheckClick = async () => {
    console.log(phoneNumber);
    if (!phoneNumber) {
      setModalOpen(true);
      openModal({
        title: '휴대폰번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (phoneNumber.length != 11) {
      setModalOpen(true);
      openModal({
        title: '입력된 휴대폰 번호가 올바르지 않습니다.',
        context: '다시 확인해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      setIsClicked(true);
      setTimeLeft(180);
      // 기존 타이머 있을 경우 초기화
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

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
        console.log(response);

        if (response.status == 200) {
          setModalOpen(true);
          openModal({
            title: `${phoneNumber} (으)로 인증번호가 발송되었습니다.`,
            type: 'success',
            isAutoClose: true,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 인증번호 입력 감지
  const handleAuthInputChange = (e) => {
    setAuthCode(e.target.value);
  };

  const handlePhoneNumberAuthClick = async () => {
    console.log(authCode);
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/sms/verify`,
        { phoneNumber: phoneNumber, code: authCode },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.code == 200) {
        openModal({
          title: `인증이 완료되었습니다.`,
          type: 'success',
          isAutoClose: true,
          onConfirm: () => {
            closeModal(), setModalOpen(false);
          },
        });
        setModalOpen(true);
        setIsAuthVerified(true);
        clearInterval(timerRef.current);
        setIsValidPhoneNumber(true);
        timerRef.current = null;
      }
    } catch (error) {
      setModalOpen(true);
      openModal({
        title: '인증 번호가 일치하지 않습니다.',
        context: '올바른 인증 번호를 입력해 주세요.',
        type: 'warning',
        isAutoClose: true,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    }
  };

  // 타이머 로직
  useEffect(() => {
    if (timeLeft === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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
            pattern="[0-9]+"
            maxLength="11"
            value={phoneNumber}
            onChange={handlePhoneNumberInputChange}
            className="flex-grow p-2 mb-1 border rounded-lg"
            placeholder="숫자만 입력해주세요"
            disabled={isAuthVerified}
          />
          <button
            type="submit"
            onClick={handlePhoneNumberCheckClick}
            className={`flex-grow-0 px-4 py-2 mb-2 font-bold transition-colors duration-300 rounded-lg  ${
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

        {isClicked && !isAuthVerified && (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-center w-full mb-1 space-x-2">
              <input
                type="text"
                value={authCode}
                className="flex-grow p-2 border rounded-lg"
                placeholder="인증번호 5자리를 입력해주세요"
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
                인증번호를 발송했습니다. (유효시간 3분)
              </span>
            </div>
          </div>
        )}
      </div>
      {modalOpen && <RenderModal />}
    </>
  );
};

export default PhoneNumberInfoForm;

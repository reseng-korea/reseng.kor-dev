import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';

import success from '../assets/modal_success.png';
import warning from '../assets/modal_warning.png';

Modal.setAppElement('#root'); // 접근성 설정

function CustomModal({
  isOpen,
  closeModal,
  primaryText = '',
  secondaryText = '',
  context = '',
  type = 'info',
  isAutoClose = false,
  cancleButton = false,
  buttonName = '확인',
  cancleButtonName = '취소',
  onConfirm = () => {},
  onCancel,
}) {
  const timerRef = useRef(null);

  // 모달 열렸을 때 Enter 키 감지
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Enter') {
        e.preventDefault(); // 기본 동작 방지
        closeModal(); // 모달 닫기
      }
    };

    // 이벤트 리스너 추가
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // 이벤트 리스너 제거
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onConfirm]);

  useEffect(() => {
    // openModal 함수 내부
    console.log('5. CustomModal로 왔다.', {
      primaryText,
      secondaryText,
      context,
      type,
      isAutoClose,
      cancleButton,
      buttonName,
      cancleButtonName,
      onConfirm,
      onCancel,
    });

    if (isOpen && isAutoClose && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        closeModal();
        timerRef.current = null;
      }, 10000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, closeModal]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false} // 모달 외부 클릭으로 닫히지 않음
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999, // 오버레이의 z-index를 높게 설정
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          width: '500px',
          minHeight: '300px',
          padding: '40px',
          // marginRight: '100px',
          background: 'white',
          borderRadius: '10px',
          outline: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 10000, // 모달 콘텐츠도 nav보다 높게 설정
        },
      }}
      className="slide-up"
    >
      {type === 'success' && (
        <img src={success} alt="성공" className="w-16 h-16" />
      )}
      {type === 'warning' && (
        <img src={warning} alt="경고" className="w-16 h-16" />
      )}

      <h2 className="mt-4 text-xl font-bold text-center">{primaryText}</h2>
      <h2 className="text-xl font-bold text-center">{secondaryText}</h2>

      {context && <p className="mt-4 text-center">{context}</p>}

      {isAutoClose && (
        <span className="text-gray-500 text-xs mt-2">
          (10초 뒤 창이 사라집니다.)
        </span>
      )}

      <div className="flex space-x-2">
        <button
          onClick={onConfirm || closeModal}
          className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-hover"
        >
          {buttonName}
        </button>
        {cancleButton && (
          <button
            onClick={onCancel || closeModal}
            className="mt-6 px-4 py-2 border border-primary text-primary rounded-lg hover:border-hoverLight hover:bg-hoverLight"
          >
            {cancleButtonName}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default CustomModal;

import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';

import success from '../assets/modal_success.png';
import warning from '../assets/modal_warning.png';

Modal.setAppElement('#root'); // 접근성 설정

function CustomModal({
  isOpen,
  closeModal,
  title = '',
  context = '',
  type = 'info',
  isAutoClose = false,
  cancleButton = false,
  onConfirm = () => {},
  onCancel,
}) {
  console.log('CustomModal로 넘어온 title:', title);
  const timerRef = useRef(null);

  useEffect(() => {
    // openModal 함수 내부
    console.log('5. CustomModal로 왔다.', {
      title,
      context,
      type,
      isAutoClose,
      cancleButton,
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
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          width: '500px',
          minHeight: '300px',
          padding: '20px',
          background: 'white',
          borderRadius: '10px',
          outline: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      {type === 'success' && (
        <img src={success} alt="성공" className="w-16 h-16" />
      )}
      {type === 'warning' && (
        <img src={warning} alt="경고" className="w-16 h-16" />
      )}

      <h2 className="mt-4 text-xl font-bold text-center">{title}</h2>

      {context && <p className="text-center">{context}</p>}

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
          확인
        </button>
        {cancleButton && (
          <button
            onClick={onCancel || closeModal}
            className="mt-6 px-4 py-2 border border-primary text-primary rounded-lg hover:border-hover hover:text-hover"
          >
            취소
          </button>
        )}
      </div>
    </Modal>
  );
}

export default CustomModal;

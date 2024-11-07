import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';

import success from '../assets/modal_success.png';
import warning from '../assets/modal_warning.png';

Modal.setAppElement('#root'); // 접근성 설정

function CustomModal({
  isOpen,
  closeModal,
  title,
  context,
  type,
  autoCloseMessage,
}) {
  const timerRef = useRef(null); // 타이머 참조 생성
  //   useEffect(() => {
  //     if (isOpen && !timerRef.current) {
  //       console.log('5초 타이머 시작');
  //       timerRef.current = setTimeout(() => {
  //         console.log('모달 닫기 호출');
  //         closeModal();
  //         timerRef.current = null; // 타이머가 실행된 후 참조 초기화
  //       }, 5000);
  //     }

  //     return () => {
  //       if (timerRef.current) {
  //         clearTimeout(timerRef.current);
  //         timerRef.current = null;
  //       }
  //     };
  //   }, [isOpen]); // 빈 배열을 추가하여 최초로 한 번만 실행되도록 설정

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
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
          alignItems: 'center', // 가로 중앙 정렬
          justifyContent: 'center', // 세로 중앙 정렬
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
      <p className="text-center">{context}</p>
      <span className="text-gray3 text-xs mt-2">{autoCloseMessage}</span>
      {/* <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ×
      </button> */}
      <button
        onClick={closeModal}
        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-hover"
      >
        확인
      </button>
    </Modal>
  );
}

export default CustomModal;

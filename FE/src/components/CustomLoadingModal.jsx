import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // 접근성 설정

function CustomLoadingModal({ isOpen }) {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Loading"
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
      <div className="flex flex-col items-center">
        {/* <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div> */}
        <div className="loader mb-6"></div>
        <p className="text-lg font-bold">
          이메일 중복 여부를 확인하고 있습니다.
        </p>
      </div>
    </Modal>
  );
}

export default CustomLoadingModal;

import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // 접근성 설정

function CustomModalWithInput({
  isOpen,
  closeModal,
  primaryText = '',
  secondaryText = '',
  context = '',
  subContext = '',
  cancleButton = false,
  buttonName = '확인',
  cancleButtonName = '취소',
  onConfirm = () => {},
  onCancel,
  inputPlaceholder = '비밀번호 4자리',
}) {
  const [inputValue, setInputValue] = useState(''); // 입력 값 상태 관리

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 확인 버튼 클릭 시 호출되는 함수
  const handleConfirm = () => {
    onConfirm(inputValue); // 입력 값을 onConfirm 콜백에 전달
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick={false}
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          width: '600px',
          minHeight: '350px',
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
      className="slide-up"
    >
      <h2 className="mt-4 text-xl font-bold text-center">{primaryText}</h2>
      <h2 className="text-xl font-bold text-center">{secondaryText}</h2>

      {context && <p className="mt-4 text-center">{context}</p>}
      {subContext && <p className="text-center">{subContext}</p>}

      <div className="flex mt-8 space-x-2 justify-center items-center">
        <span>비밀번호</span>
        <input
          type="text"
          value={inputValue}
          maxLength="4"
          onChange={handleInputChange}
          placeholder={inputPlaceholder}
          className="px-4 py-2 border rounded-lg text-center"
        />
      </div>

      <div className="flex space-x-2 mt-6">
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-hover"
        >
          {buttonName}
        </button>
        {cancleButton && (
          <button
            onClick={onCancel || closeModal}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:border-hoverLight hover:bg-hoverLight"
          >
            {cancleButtonName}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default CustomModalWithInput;

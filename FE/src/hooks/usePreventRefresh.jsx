// src/hooks/usePreventRefresh.js
import { useEffect } from 'react';

const usePreventRefresh = (openModal, closeModal, setModalOpen) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === 'F5' ||
        (e.ctrlKey && e.key === 'r') ||
        (e.metaKey && e.key === 'r')
      ) {
        e.preventDefault();
        setModalOpen(true);
        openModal({
          primaryText: '새로고침 시 입력한 내용이 모두 사라집니다.',
          context: '새로고침하시겠습니까?',
          type: 'warning',
          isAutoClose: false,
          cancleButton: true,
          onConfirm: () => {
            closeModal();
            setModalOpen(false);
            window.location.reload();
          },
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [openModal, closeModal, setModalOpen]);
};

export default usePreventRefresh;

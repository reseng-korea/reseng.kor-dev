import { useEffect, useState } from 'react';
import { useNavigateTo } from '../hooks/useNavigateTo';
import useModal from '../hooks/useModal';

const ProtectedRoute = ({ isAuthenticated, children }) => {
  const { navigateTo, routes } = useNavigateTo();
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태
  const { openModal, closeModal, RenderModal } = useModal();

  useEffect(() => {
    if (!isAuthenticated && !modalOpen) {
      // 모달이 이미 열려 있지 않다면 모달을 엶
      setModalOpen(true);
      openModal({
        primaryText: '로그인 후 이용하실 수 있습니다.',
        context: '로그인 페이지로 이동합니다.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
          setModalOpen(false); // 모달 닫힘 상태로 변경
          navigateTo(routes.signin); // 로그인 페이지로 이동
        },
      });
    }
  }, [isAuthenticated, modalOpen, openModal, closeModal, navigateTo, routes]);

  return <>{isAuthenticated ? children : <RenderModal />}</>;
};

export default ProtectedRoute;

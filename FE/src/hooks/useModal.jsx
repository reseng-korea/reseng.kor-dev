import { useState } from 'react';
import CustomModal from '../components/CustomModal';

const useModal = () => {
  console.log('2.useModal에서 받았다.');
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: '',
    context: '',
    type: 'info', // success or warning
    isAutoClose: false, // true이면 자동 닫힘
    cancleButton: false, // 취소 버튼
    onConfirm: () => {}, // 첫 번째 버튼 클릭 핸들러
    onCancel: null, // 두 번째 버튼 클릭 핸들러 (있을 경우)
  });

  const openModal = ({
    title,
    context = '',
    type = 'info',
    isAutoClose = false,
    cancleButton = false,
    onConfirm = () => {},
    onCancel = null,
  }) => {
    setModalProps({
      title,
      context,
      type,
      isAutoClose,
      cancleButton,
      onConfirm,
      onCancel,
    });
    // setTimeout(() => setIsOpen(true), 0);
    setIsOpen(true);
    console.log('3. 받은 내용이다. title : ', title);
  };

  const closeModal = () => setIsOpen(false);

  const RenderModal = () => {
    console.log('4. RenderModal로 왔다.', isOpen);
    // useEffect(() => {
    //   if (isOpen) {
    //     console.log('Modal is open with props:', modalProps);
    //   }
    // }, [isOpen, modalProps]);

    return isOpen ? (
      <CustomModal
        isOpen={isOpen}
        closeModal={closeModal}
        title={modalProps.title}
        context={modalProps.context}
        type={modalProps.type}
        isAutoClose={modalProps.isAutoClose}
        cancleButton={modalProps.cancleButton}
        onConfirm={modalProps.onConfirm}
        onCancel={modalProps.onCancel}
      />
    ) : null;
  };

  return { openModal, closeModal, RenderModal };
};

export default useModal;

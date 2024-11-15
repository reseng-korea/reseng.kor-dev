import { useState } from 'react';

import CustomModal from '../components/CustomModal';
import CustomModalWithInput from '../components/CustomModalWithInput';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('default');
  const [modalProps, setModalProps] = useState({
    primaryText: '',
    secondaryText: '',
    context: '',
    type: 'info',
    isAutoClose: false,
    cancleButton: false,
    buttonName: '확인',
    cancleButtonName: '취소',
    onConfirm: () => {},
    onCancel: null,
  });

  const [modalInputProps, setModalInputProps] = useState({
    primaryText: '',
    secondaryText: '',
    context: '',
    subContext: '',
    inputPlaceholder: '',
    type: 'info',
    cancleButton: true,
    buttonName: '확인',
    cancleButtonName: '취소',
    onConfirm: () => {},
    onCancel: null,
  });

  const openModal = ({
    primaryText,
    secondaryText = '',
    context = '',
    type = 'info',
    isAutoClose = false,
    cancleButton = false,
    buttonName = '확인',
    cancleButtonName = '취소',
    onConfirm = () => {},
    onCancel = null,
  }) => {
    setModalType('default');
    setModalProps({
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
    setIsOpen(true);
  };

  const openModalWithInput = ({
    primaryText,
    secondaryText = '',
    context = '',
    subContext = '',
    inputPlaceholder = '',
    type = 'info',
    cancleButton = true,
    buttonName = '확인',
    cancleButtonName = '취소',
    onConfirm = (inputValue) => {},
    onCancel = null,
  }) => {
    setModalType('input');
    setModalInputProps({
      primaryText,
      secondaryText,
      context,
      subContext,
      inputPlaceholder,
      type,
      cancleButton,
      buttonName,
      cancleButtonName,
      onConfirm,
      onCancel,
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const RenderModal = () => {
    if (!isOpen) return null;

    if (modalType === 'input') {
      return (
        <CustomModalWithInput
          isOpen={isOpen}
          closeModal={closeModal}
          primaryText={modalInputProps.primaryText}
          secondaryText={modalInputProps.secondaryText}
          context={modalInputProps.context}
          subContext={modalInputProps.subContext}
          inputPlaceholder={modalInputProps.inputPlaceholder}
          type={modalInputProps.type}
          cancleButton={modalInputProps.cancleButton}
          buttonName={modalInputProps.buttonName}
          cancleButtonName={modalInputProps.cancleButtonName}
          onConfirm={modalInputProps.onConfirm}
          onCancel={modalInputProps.onCancel}
        />
      );
    }

    return (
      <CustomModal
        isOpen={isOpen}
        closeModal={closeModal}
        primaryText={modalProps.primaryText}
        secondaryText={modalProps.secondaryText}
        context={modalProps.context}
        type={modalProps.type}
        isAutoClose={modalProps.isAutoClose}
        cancleButton={modalProps.cancleButton}
        buttonName={modalProps.buttonName}
        cancleButtonName={modalProps.cancleButtonName}
        onConfirm={modalProps.onConfirm}
        onCancel={modalProps.onCancel}
      />
    );
  };

  return { openModal, openModalWithInput, closeModal, RenderModal };
};

export default useModal;

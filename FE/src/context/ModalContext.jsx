import { createContext, useContext } from 'react';
import useModal from '../hooks/useModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const { openModal, RenderModal } = useModal();

  return (
    <ModalContext.Provider value={{ openModal, RenderModal }}>
      {children}
      <RenderModal />
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);

import React, { useState } from 'react';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import useModal from '../../hooks/useModal';

const UserConfirm = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [password, setPassword] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const accesstoken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
        const response = await apiClient.post(
          `${apiUrl}/api/v1/users/${userId}/password/verify`,
          { password: password },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        // console.log(response);
        navigateTo(routes.mypageUserEdit);
      } catch (error) {
        const errorCode = error.response?.data?.code;

        if (errorCode == 4000 || errorCode == 4026) {
          setModalOpen(true);
          openModal({
            primaryText: '비밀번호가 일치하지 않습니다.',
            context: '다시 확인해 주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
            },
          });
        }
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mb-1 space-x-2">
          <span className="pt-16 mb-6 text-3xl font-bold">회원 정보 확인</span>
          <span className="mb-2 text-sm lg:text-lg">
            고객님의 소중한 정보 보호를 위해 비밀번호를 다시 한 번 확인해
            주세요.
          </span>
          <span className="mb-8 text-sm text-gray3">
            고객님의 비밀번호가 타인에게 노출되지 않도록 조심해 주세요.
          </span>
          <hr className="w-full mb-12 border-t-2 border-primary" />

          <form>
            <div className="flex flex-col w-full max-w-lg mb-12">
              <label className="self-start mb-1 text-lg">비밀번호</label>
              <span className="self-start mb-2 text-xs text-gray3">
                영문, 숫자, 특수문자를 포함한 8자 이상, 16자 이하의 비밀번호를
                입력해주세요.
              </span>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-2 mb-1 border rounded-lg mx-auto"
                placeholder="비밀번호를 입력해주세요"
              />
            </div>

            <button
              onClick={handleSubmit}
              type="submit"
              className="w-[30%] px-4 py-3 mb-2 font-bold text-white bg-primary rounded-lg hover:bg-hover"
            >
              확인
            </button>
          </form>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </Layout>
  );
};

export default UserConfirm;

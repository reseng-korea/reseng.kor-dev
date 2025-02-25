import React, { useState, useEffect } from 'react';

import useModal from '../../hooks/useModal';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import usePreventRefresh from '../../hooks/usePreventRefresh';
import apiClient from '../../services/apiClient';
import {
  validatePassword,
  checkPasswordMatch,
} from '../../utils/PasswordValidation';

const ChangePasswordPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();

  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const accesstoken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  const [tempPassword, setTempPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState('');
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const handleTempPasswordChange = (e) => {
    setTempPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  useEffect(() => {
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmPasswordValid = validatePassword(confirmNewPassword);
    const doesPasswordMatch = checkPasswordMatch(
      newPassword,
      confirmNewPassword
    );
    setIsValidPassword(isPasswordValid && isConfirmPasswordValid);
    setIsPasswordMatched(doesPasswordMatch);
  }, [newPassword, confirmNewPassword]);

  // 비밀번호 변경하기 버튼 클릭
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tempPassword) {
      setModalOpen(true);
      openModal({
        primaryText: '임시 비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!newPassword) {
      setModalOpen(true);
      openModal({
        primaryText: '새로운 비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!confirmNewPassword) {
      setModalOpen(true);
      openModal({
        primaryText: '새로운 비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isValidPassword) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호 입력 조건을 확인해주세요.',

        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isPasswordMatched) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호가 일치하지 않습니다.',
        context: ' 확인 후 다시 입력해 주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
        const response = await apiClient.put(
          `${apiUrl}/api/v1/users/${userId}/password`,
          { oldPassword: tempPassword, newPassword: newPassword },
          {
            headers: {
              Authorization: accesstoken,
            },
          }
        );

        if (response.data.code == 201) {
          setModalOpen(true);
          openModal({
            primaryText: '비밀번호가 변경되었습니다.',
            type: 'success',
            isAutoClose: false,
            onConfirm: () => {
              closeModal();
              setModalOpen(false);
              navigateTo(routes.home);
            },
          });
        }
      } catch (error) {
        const code = error.response.data.code;
        if (code == 4000 || code == 4026) {
          setModalOpen(true);
          openModal({
            primaryText: '입력하신 임시 비밀번호가 올바르지 않습니다.',
            context: '확인 후 다시 입력해주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal();
              setModalOpen(false);
            },
          });
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen slide-up">
      <form className="w-full max-w-2xl p-8">
        <h1 className="pt-16 mb-6 text-2xl text-center font-bold">
          비밀번호 변경
        </h1>
        <p className="mb-2 text-xs">
          임시 비밀번호로 로그인되었습니다.
          <br />
          안전한 계정 사용을 위해 새로운 비밀번호를 설정해주세요.
        </p>
        <hr className="w-full mb-6 border-t-2 border-primary" />

        {/* 임시 비밀번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">임시 비밀번호</label>
          <input
            type="password"
            value={tempPassword}
            onChange={handleTempPasswordChange}
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="임시 비밀번호를 입력해주세요"
          />
        </div>

        {/* 새로운 비밀번호 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-1 text-lg">새로운 비밀번호</label>
          <span className="self-start mb-2 text-xs text-gray3">
            영문, 숫자, 특수문자를 포함한 8자 이상, 16자 이하의 비밀번호를
            입력해주세요.
          </span>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="새로운 비밀번호를 입력해주세요"
          />
        </div>

        {/* 새로운 비밀번호 확인 */}
        <div className="flex flex-col items-center px-3 py-2">
          <label className="self-start mb-2 text-lg">
            새로운 비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            className="w-full p-2 mb-1 border rounded-lg"
            placeholder="새로운 비밀번호를 한 번 더 입력해주세요"
          />
          {!isPasswordMatched && confirmNewPassword && (
            <span className="self-start text-xs text-warning">
              비밀번호가 일치하지 않습니다.
            </span>
          )}
        </div>

        {/* 비밀번호 변경하기 버튼 */}
        <div className="flex flex-col items-center px-3 py-2">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-lg hover:bg-hover"
          >
            비밀번호 변경하기
          </button>
        </div>
      </form>
      {modalOpen && <RenderModal />}
    </div>
  );
};

export default ChangePasswordPage;

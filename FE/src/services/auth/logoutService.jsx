import apiClient from '../apiClient';

/**
 * Logs out the user and handles modal and navigation
 * @param {string} apiUrl - The API base URL
 * @param {object} handlers - Object containing modal and navigation handlers
 * @param {function} handlers.openModal - Function to open the modal
 * @param {function} handlers.closeModal - Function to close the modal
 * @param {function} handlers.navigateTo - Function to navigate to another route
 * @param {object} handlers.routes - Routes object for navigation
 */
export const logoutService = async (
  apiUrl,
  { openModal, closeModal, navigateTo, routes }
) => {
  try {
    const response = await apiClient.post(
      `${apiUrl}/api/v1/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.data.code === 200) {
      openModal({
        primaryText: '로그아웃되었습니다.',
        context: '이용해 주셔서 감사합니다.',
        type: 'success',
        isAutoClose: false,
        onConfirm: () => {
          navigateTo(routes.home);
          window.location.reload();
          closeModal();
        },
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
    }
    return response;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    openModal({
      primaryText: '로그아웃에 실패했습니다.',
      context: '잠시 후 다시 시도해주세요.',
      type: 'warning',
      isAutoClose: false,
      onConfirm: () => {
        closeModal();
      },
    });
    throw error;
  }
};

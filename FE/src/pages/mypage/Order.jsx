import React, { useEffect, useState } from 'react';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import useModal from '../../hooks/useModal';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import usePreventRefresh from '../../hooks/usePreventRefresh';

const Order = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();
  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const { navigateTo, routes } = useNavigateTo();
  const optionValues = Array.from({ length: 16 }, (_, i) => 300 + i * 100);

  const [orders, setOrders] = useState([
    { id: Date.now(), temporaryTypeWidth: optionValues[0], quantity: '' }, // 초기 값 1개
  ]);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  // 추가하기
  const handleAddOrder = () => {
    setOrders((prevOrders) => [
      ...prevOrders,
      { id: Date.now(), temporaryTypeWidth: optionValues[0], quantity: '' },
    ]);
  };

  // 삭제하기
  const handleDeleteOrder = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
  };

  // 폭 변경 핸들러
  const handleWidthChange = (id, value) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, temporaryTypeWidth: value } : order
      )
    );
  };

  // 롤 변경 핸들러
  const handleRollChange = (id, value) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, quantity: value } : order
      )
    );
  };

  // 발주 넣기
  const handleSubmit = async () => {
    if (orders.length === 0) {
      openModal({
        primaryText: '발주 내역이 없습니다.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    }

    const isValid = orders.every(
      (order) =>
        order.temporaryTypeWidth && // 폭 값이 유효한지 확인
        order.quantity && // 롤 수량이 유효한지 확인
        parseInt(order.quantity) > 0 // 수량이 0 이상인지 확인
    );

    if (!isValid) {
      openModal({
        primaryText: '모든 발주 항목에',
        secondaryText: '유효한 폭과 롤 수량을 입력하세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    }

    // `id`를 제외한 데이터 변환
    const bannerRequests = orders.map(({ temporaryTypeWidth, quantity }) => ({
      temporaryTypeWidth: parseInt(temporaryTypeWidth), // 숫자로 변환
      quantity: parseInt(quantity), // 숫자로 변환
    }));

    try {
      const response = await apiClient.post(
        `${apiUrl}/api/v1/orders`,
        {
          bannerRequests,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response);

      if (response.data.code == 201) {
        openModal({
          primaryText: '발주 요청이 성공적으로 완료되었습니다.',
          type: 'success',
          isAutoClose: false,
          onConfirm: () => {
            closeModal();
            navigateTo(routes.mypageOrderList);
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      openModal({
        primaryText: '발주 요청에 실패했습니다.',
        context: '잠시 후 다시 시도해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
    }
  };

  // 초기화
  const handleResetOrders = () => {
    if (orders.length != 0) {
      openModal({
        primaryText: '변경 사항이 저장되지 않습니다.',
        secondaryText: '초기화하시겠습니까?',
        type: 'warning',
        isAutoClose: false,
        cancleButton: true,
        onConfirm: () => {
          closeModal();
          setOrders([]);
        },
      });
    }
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="현수막 발주"
            mainCategory="마이페이지"
          />
          {/* 더 하위 카테고리 */}
          <div className="flex w-full space-x-2">
            <div className="flex flex-col w-1/6 justify-start mb-4">
              <button
                onClick={() => navigateTo(routes.mypageOrder)}
                className="flex items-center justify-start h-10 border-l-4 border-l-primary rounded-none"
              >
                <span className="py-2 text-primary font-bold">발주</span>
              </button>
              <button
                onClick={() => navigateTo(routes.mypageOrderList)}
                className="flex items-center justify-start h-10"
              >
                <span className="py-2">발주 내역</span>
              </button>
              <button
                onClick={() => navigateTo(routes.mypageOfferList)}
                className="flex items-center justify-start h-10 "
              >
                <span className="py-2">발주 받은 내역</span>
              </button>
            </div>
            {/* 메인 */}
            <div className="w-5/6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-center py-4 border border-gray3 rounded-lg mb-6 space-x-4"
                >
                  <div className="flex w-4/5">
                    <div className="flex w-1/2 items-center justify-end space-x-4">
                      <span className="text-lg font-bold">폭</span>
                      <select
                        className="w-2/3 p-2 rounded-lg border border-gray3"
                        value={order.temporaryTypeWidth}
                        onChange={(e) =>
                          handleWidthChange(order.id, e.target.value)
                        }
                      >
                        {optionValues.map((value) => (
                          <option key={value} value={value}>
                            {`${value}mm`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex w-1/2 items-center justify-center space-x-4">
                      <span className="text-lg font-bold">롤</span>
                      <input
                        className="w-2/3 p-2 rounded-lg border border-gray3"
                        type="text"
                        value={order.quantity}
                        onChange={(e) =>
                          handleRollChange(order.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex px-5 justify-end w-1/5">
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="flex items-center justify-center h-10 border border-warning hover:bg-warningHover hover:border-warningHover"
                    >
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              ))}

              <div
                onClick={handleAddOrder}
                className="py-4 border border-gray3 rounded-lg mb-6 hover:bg-placeHolder"
              >
                <span className="text-lg font-bold cursor-pointer">
                  + 추가하기
                </span>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleResetOrders}
                  className="flex px-6 items-center justify-center h-10 border border-primary hover:bg-hoverLight hover:border-hoverLight"
                >
                  <span className="text-primary font-bold">초기화</span>
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex px-8 items-center justify-center h-10 bg-primary hover:bg-hover"
                >
                  <span className="text-white font-bold">발주 넣기</span>
                </button>
              </div>
            </div>
          </div>

          {/*  */}
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default Order;

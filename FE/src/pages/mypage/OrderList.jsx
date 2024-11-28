import React, { useState, useEffect } from 'react';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import useModal from '../../hooks/useModal';

const OrderList = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const { navigateTo, routes } = useNavigateTo();

  const { openModal, closeModal, RenderModal } = useModal();

  const [orderList, setOrderList] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${apiUrl}/api/v1/orders`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response);
        setOrderList(response.data.data);

        const { total, inProgress, completed } = response.data.data.reduce(
          (acc, order) => {
            acc.total++;
            if (order.receiveStatus) {
              acc.completed++;
            } else {
              acc.inProgress++;
            }
            return acc;
          },
          { total: 0, inProgress: 0, completed: 0 }
        );
        setSummary({ total, inProgress, completed });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const isReceivedHandler = async (orderId) => {
    console.log(orderId);
    try {
      const response = await apiClient.patch(
        `${apiUrl}/api/v1/orders/${orderId}`,
        {
          receiveStatus: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response);

      openModal({
        primaryText: '수령이 완료되었습니다.',
        type: 'success',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
          window.location.reload();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const statusMapping = {
    UNCONFIRMED: {
      text: '미확인',
      className: 'text-lg text-warning font-bold',
      backgroundClassName: 'bg-warningHover',
    },
    CONFIRMED: {
      text: '확인 완료',
      className: 'text-lg text-re font-bold',
      backgroundClassName: 'bg-reHover',
    },
    SHIPPED_COURIER: {
      text: '출고 완료(택배)',
      className: 'text-lg text-primary font-bold',
      backgroundClassName: 'bg-hoverLight',
    },
    SHIPPED_FREIGHT: {
      text: '출고 완료(화물)',
      className: 'text-lg text-primary font-bold',
      backgroundClassName: 'bg-hoverLight',
    },
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2 mb-12">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="현수막 발주"
            mainCategory="마이페이지"
          />
          <div className="flex w-full space-x-2">
            {/* 더 하위 카테고리 */}
            <div className="flex flex-col w-1/6 justify-start mb-4">
              <button
                onClick={() => navigateTo(routes.mypageOrder)}
                className="flex items-center justify-start h-10"
              >
                <span className="py-2">발주</span>
              </button>
              <button
                onClick={() => navigateTo(routes.mypageOrderList)}
                className="flex items-center justify-start h-10 border-l-4 border-l-primary rounded-none"
              >
                <span className="py-2 text-primary font-bold">발주 내역</span>
              </button>
              <button
                onClick={() => navigateTo(routes.mypageOfferList)}
                className="flex items-center justify-start h-10 "
              >
                <span className="py-2">발주 받은 내역</span>
              </button>
            </div>
            {/* 메인 */}
            <div className="flex flex-col w-5/6 px-8 py-4 justify-center items-center">
              {/* 현재 진행 현황 */}
              {orderList.length !== 0 && (
                <>
                  <div className="flex w-full space-x-6 items-center justify-center mb-6">
                    <div className="flex w-1/4 flex-col py-6 justify-center items-center space-y-2 border border-gray2 rounded-lg">
                      <span className="text-lg">전체 발주</span>
                      <span className="text-lg font-bold">
                        {summary.total}건
                      </span>
                    </div>
                    <div className="flex w-1/4 flex-col py-6 justify-center items-center space-y-2 border border-gray2 rounded-lg">
                      <span className="text-lg">진행 중</span>
                      <span className="text-lg font-bold">
                        {summary.inProgress}건
                      </span>
                    </div>
                    <div className="flex w-1/4 flex-col py-6 justify-center items-center space-y-2 border border-gray2 rounded-lg">
                      <span className="text-lg">완료</span>
                      <span className="text-lg font-bold">
                        {summary.completed}건
                      </span>
                    </div>
                  </div>
                  <hr className="w-full border-t border-gray2 mb-8" />
                </>
              )}
              {/* 발주 내역 */}
              {orderList.length > 0 ? (
                orderList.map((order, index) => {
                  const {
                    text: statusText,
                    className: statusClassName,
                    backgroundClassName,
                  } = statusMapping[order.orderStatus];

                  return (
                    <div
                      key={index}
                      className="flex flex-wrap w-full justify-center px-4 py-4 space-x-4 mb-8"
                    >
                      {/* 업체명, 날짜 */}
                      <div className="flex flex-col w-3/12 py-4 space-y-3 border border-gray2 rounded-2xl">
                        <div className="flex flex-col items-start ml-6">
                          <span className="text-gray4 font-bold mb-1">
                            업체명
                          </span>
                          <div className=" text-md">
                            {order.userResponseDto.companyName}
                          </div>
                        </div>
                        <div className="flex flex-col items-start ml-6">
                          <span className="text-gray4 font-bold mb-1">
                            발주 날짜
                          </span>
                          <div className=" text-md">{order.orderDate}</div>
                        </div>
                      </div>

                      {/* 발주 내역 */}
                      <div className="flex w-8/12 justify-between items-center border border-gray2 rounded-2xl px-5 py-4">
                        <div className="flex flex-col w-7/12 justify-center items-center">
                          <div className="flex mb-6">
                            <span className="text-lg font-bold">발주 내역</span>
                          </div>
                          {order.temporaryBannerTypeResponseDtoList.map(
                            (item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="w-full flex justify-center items-center space-x-12 mb-4"
                              >
                                <div className="flex w-9 h-9 justify-center items-center border border-gray2 rounded-full">
                                  <span>{itemIndex + 1}</span>
                                </div>
                                <div className="font-bold">
                                  {item.temporaryTypeWidth}m
                                </div>
                                <div className="font-bold">
                                  {item.quantity}롤
                                </div>
                              </div>
                            )
                          )}
                        </div>
                        {/* 상태 */}
                        <div className="flex flex-col w-4/12 mr-4 px-2 py-4 justify-center items-center border border-gray2 rounded-2xl">
                          <div className="mb-4">
                            <span className="text-lg font-bold">상태 확인</span>
                          </div>
                          <div
                            className={`px-5 py-2 rounded-full ${backgroundClassName} mb-2`}
                          >
                            <span className={statusClassName}>
                              {statusText}
                            </span>
                          </div>
                          {(order.orderStatus === 'SHIPPED_COURIER' ||
                            order.orderStatus === 'SHIPPED_FREIGHT') && (
                            <>
                              {!order.receiveStatus ? (
                                <>
                                  <div
                                    onClick={() => isReceivedHandler(order.id)}
                                    className="px-5 py-2 mb-2 rounded-full text-lg text-primary font-bold bg-hoverLight hover:bg-primary hover:text-white"
                                  >
                                    수령 완료
                                  </div>
                                  <span className="text-xs text-gray2">
                                    수령 완료 후 버튼을 눌러주세요.
                                  </span>
                                </>
                              ) : (
                                <>
                                  <div className="px-5 py-2 mb-2 rounded-full text-lg text-gray-400 font-bold bg-gray-200">
                                    수령 완료
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    수령 완료된 상태입니다.
                                  </span>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col w-5/6 px-8 py-8 justify-center items-center">
                  <div className="flex justify-center items-center mt-24">
                    <span>발주 내역이 없습니다.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default OrderList;

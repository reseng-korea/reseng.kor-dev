import React, { useState, useEffect } from 'react';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const OfferList = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const { navigateTo, routes } = useNavigateTo();

  const [offerList, setOfferList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${apiUrl}/api/v1/orders/seller`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response);
        setOfferList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleOrderStatus = async (id, newStatus) => {
    console.log(id);
    console.log(newStatus);
    setOfferList((prevOfferList) =>
      prevOfferList.map((offer) =>
        offer.id === id ? { ...offer, orderStatus: newStatus } : offer
      )
    );
    try {
      const response = await apiClient.patch(
        `${apiUrl}/api/v1/orders/status/${id}`,
        {
          orderStatus: newStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
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
                className="flex items-center justify-start h-10"
              >
                <span className="py-2">발주</span>
              </button>
              <button
                onClick={() => navigateTo(routes.mypageOrderList)}
                className="flex items-center justify-start h-10"
              >
                <span className="py-2">발주 내역</span>
              </button>
              <button
                onClick={() => navigateTo(routes.mypageOfferList)}
                className="flex items-center justify-start h-10 border-l-4 border-l-primary rounded-none"
              >
                <span className="py-2 text-primary font-bold">
                  발주 받은 내역
                </span>
              </button>
            </div>
            {/* 메인 */}
            <div className="flex flex-col w-5/6 px-4 py-4 justify-center items-center border border-gray2 shadow-xl rounded-2xl">
              {offerList.length === 0 ? (
                <div className="flex justify-center items-center mt-24">
                  <span>발주 받은 내역이 없습니다.</span>
                </div>
              ) : (
                offerList.map((offer, index) => (
                  <div className="flex w-full space-x-4 mb-6">
                    <div
                      key={index}
                      className="flex flex-col w-4/5 mx-auto rounded-lg justify-between items-center"
                    >
                      {/* 업체명, 대리점 명 */}
                      <div className="flex flex-wrap w-full justify-start items-center my-4">
                        <div className="flex w-full md:w-1/2 justify-end items-center space-x-4">
                          <span className="w-1/5 text-right font-bold">
                            업체명
                          </span>
                          <div className="w-3/5 px-4 py-2 bg-gray1 rounded-full text-left">
                            {offer.userResponseDto.companyName}
                          </div>
                        </div>
                        <div className="flex w-full md:w-1/2 justify-start items-center space-x-4">
                          <span className="w-1/5 text-right font-bold">
                            날짜
                          </span>
                          <div className="w-3/5 px-4 py-2 bg-gray1 rounded-full text-left">
                            {offer.orderDate}
                          </div>
                        </div>
                      </div>
                      {/* 내역 */}
                      <div className="flex flex-wrap w-full justify-start items-center my-2">
                        {offer.temporaryBannerTypeResponseDtoList.map(
                          (item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="flex w-full md:w-1/2 justify-center items-center px-12 space-x-16 mb-4"
                            >
                              <div className="flex w-1/3 justify-center items-center">
                                <span className="inline-flex justify-center items-center px-2 py-2 w-10 h-10 border border-gray3 rounded-lg">
                                  {itemIndex + 1}
                                </span>
                              </div>
                              <div className="w-1/3 justify-center items-center">
                                {item.temporaryTypeWidth}m
                              </div>
                              <div className="w-1/3 justify-center items-center">
                                {item.quantity}롤
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* 상태 */}
                    <div className="flex flex-col w-1/5 justify-between items-center px-4 py-8 rounded-lg bg-white">
                      <span className="text-lg font-bold mb-6">
                        상태 업데이트{offer.orderStatus}
                      </span>
                      <select
                        value={offer.orderStatus}
                        onChange={(e) =>
                          handleOrderStatus(offer.id, e.target.value)
                        }
                        className="w-2/3 p-2 rounded-lg border border-gray3"
                      >
                        <option value="UNCONFIRMED">미확인</option>
                        <option value="CONFIRMED">확인 완료</option>
                        <option value="SHIPPED_COURIER">출고 완료(택배)</option>
                        <option value="SHIPPED_FREIGHT">출고 완료(화물)</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferList;

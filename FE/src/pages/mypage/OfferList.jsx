import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import { useLocation } from 'react-router-dom';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import useModal from '../../hooks/useModal';
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
  const { openModal, closeModal, RenderModal } = useModal();

  const [offerList, setOfferList] = useState([]);
  const [summary, setSummary] = useState({
    unconfirmed: 0,
    confirmed: 0,
    shippedCourier: 0,
    shippedFreight: 0,
  });

  const location = useLocation(); // 전달받은 state 접근

  useEffect(() => {
    console.log('Scroll Position:', location.state?.scrollPosition);
    // state에서 scrollPosition 값을 읽어와 스크롤 복원
    if (location.state?.scrollPosition) {
      window.scrollTo(0, location.state.scrollPosition);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${apiUrl}/api/v1/orders/seller`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response);
        const data = response.data.data;
        setOfferList(data);
        const countResult = data.reduce(
          (acc, item) => {
            switch (item.orderStatus) {
              case 'UNCONFIRMED':
                acc.unconfirmed += 1;
                break;
              case 'CONFIRMED':
                acc.confirmed += 1;
                break;
              case 'SHIPPED_COURIER':
                acc.shippedCourier += 1;
                break;
              case 'SHIPPED_FREIGHT':
                acc.shippedFreight += 1;
                break;
              default:
                break;
            }
            return acc;
          },
          { unconfirmed: 0, confirmed: 0, shippedCourier: 0, shippedFreight: 0 }
        );

        setSummary(countResult);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const options = [
    { value: 'UNCONFIRMED', label: '미확인', color: '#F75252' },
    { value: 'CONFIRMED', label: '확인 완료', color: '#2EA642' },
    { value: 'SHIPPED_COURIER', label: '출고 완료(택배)', color: '#245A98' },
    { value: 'SHIPPED_FREIGHT', label: '출고 완료(화물)', color: '#245A98' },
  ];

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #D1D5DB',
      padding: '4px',
      boxShadow: 'none',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
            ? data.color
            : isFocused
              ? color.alpha(0.1).css()
              : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? chroma.contrast(color, 'white') > 2
              ? 'white'
              : 'black'
            : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    singleValue: (styles, { data }) => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
      ':before': {
        backgroundColor: data.color,
        borderRadius: '50%',
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
      },
    }),
  };

  const handleOrderStatus = async (id, newStatus) => {
    const currentStatus = offerList.find(
      (offer) => offer.id === id
    )?.orderStatus;

    // UI 상태를 먼저 업데이트
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
      openModal({
        primaryText: '상태가 변경되었습니다.',
        type: 'success',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
          // navigateTo(routes.mypageOfferList, {
          //   scrollPosition: window.scrollY,
          // });
          // window.location.reload();
        },
      });
    } catch (error) {
      console.log(error);

      setOfferList((prevOfferList) =>
        prevOfferList.map((offer) =>
          offer.id === id ? { ...offer, orderStatus: currentStatus } : offer
        )
      );
      openModal({
        primaryText: '현재 상태와 같거나',
        secondaryText: '이전 상태로 변경할 수 없습니다.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
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
            <div className="flex flex-col w-5/6 px-4 py-4 justify-center items-center">
              {/* 현재 진행 상황 */}
              {offerList.length !== 0 && (
                <>
                  <div className="flex w-full space-x-6 items-center justify-center mb-6">
                    <div className="flex w-1/5 flex-col py-6 justify-center items-center space-y-2 border-2 border-warningHover rounded-lg bg-warningHover">
                      <span className="text-lg">미확인</span>
                      <span className="text-lg font-bold">
                        {summary.unconfirmed}건
                      </span>
                    </div>
                    <div className="flex w-1/5 flex-col py-6 justify-center items-center space-y-2 border-2 border-hoverLight rounded-lg bg-hoverLight">
                      <span className="text-lg">확인</span>
                      <span className="text-lg font-bold">
                        {summary.confirmed}건
                      </span>
                    </div>
                    <div className="flex w-1/5 flex-col py-6 justify-center items-center space-y-2 border-2 border-reHover rounded-lg bg-reHover">
                      <span className="text-lg">출고완료(택배)</span>
                      <span className="text-lg font-bold">
                        {summary.shippedCourier}건
                      </span>
                    </div>
                    <div className="flex w-1/5 flex-col py-6 justify-center items-center space-y-2 border-2 border-reHover rounded-lg bg-reHover">
                      <span className="text-lg">출고완료(화물)</span>
                      <span className="text-lg font-bold">
                        {summary.shippedFreight}건
                      </span>
                    </div>
                  </div>
                  <hr className="w-full border-t border-gray2 mb-8" />
                </>
              )}
              {/* 발주 받은 내역 */}
              {offerList.length > 0 ? (
                offerList.map((offer, index) => (
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
                          {offer.userResponseDto.companyName}
                        </div>
                      </div>
                      <div className="flex flex-col items-start ml-6">
                        <span className="text-gray4 font-bold mb-1">
                          발주 받은 날짜
                        </span>
                        <div className=" text-md">{offer.orderDate}</div>
                      </div>
                    </div>

                    {/* 발주 내역 */}
                    <div className="flex w-8/12 justify-between items-center border border-gray2 rounded-2xl px-5 py-4">
                      <div className="flex flex-col w-7/12 justify-center items-center">
                        <div className="flex mb-6">
                          <span className="text-lg font-bold">발주 내역</span>
                        </div>
                        {offer.temporaryBannerTypeResponseDtoList.map(
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
                              <div className="font-bold">{item.quantity}롤</div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="border-l border-gray2 h-full"></div>
                      {/* 상태 */}
                      <div className="flex flex-col w-4/12 justify-center items-center">
                        <div>
                          <span className="text-lg font-bold">상태 확인</span>
                          <Select
                            value={options.find(
                              (option) => option.value === offer.orderStatus
                            )}
                            onChange={(selectedOption) =>
                              handleOrderStatus(offer.id, selectedOption.value)
                            }
                            options={options}
                            styles={colourStyles}
                            className="w-full mt-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col w-5/6 px-8 py-8 justify-center items-center">
                  <div className="flex justify-center items-center mt-24">
                    <span>발주 받은 내역이 없습니다.</span>
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

export default OfferList;

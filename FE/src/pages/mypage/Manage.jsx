import React, { useState, useEffect } from 'react';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Manage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const loginType = localStorage.getItem('loginType');

  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    {
      label: '회원 정보 수정',
      route: loginType === 'SOCIAL' ? '/mypage/user/edit' : '/mypage/user',
    },
  ];

  const [currentStock, setCurrentStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${apiUrl}/api/v1/inventory`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // console.log(response);
        setCurrentStock(response.data.data);
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="현수막 관리"
            mainCategory="마이페이지"
          />

          {/* 메인 */}
          <div className="flex flex-col mb-12 slide-down">
            {currentStock.length == 0 ? (
              <div className="flex flex-col justify-center items-center mt-24 h-1/2">
                <span>현재 재고 수량이 없습니다.</span>
              </div>
            ) : (
              <>
                <span className="text-2xl text-left font-bold mb-6">
                  현재 재고 수량
                </span>
                <table className="min-w-full border border-gray2 border-collapse">
                  <thead>
                    <tr className="border border-gray4 text-left">
                      <th className="px-2 py-3 border border-gray2">폭</th>
                      <th className="px-2 py-3 border border-gray2">
                        정단(120yd) 개수
                      </th>
                      <th className="px-2 py-3 border border-gray2">
                        비정단(120yd 외) 길이별 개수
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStock.map((stock, index) => (
                      <tr key={index} className="border border-gray2">
                        <td className="px-2 py-2 border border-gray2 text-left">
                          {stock.typeWidth}
                        </td>
                        <td className="px-2 py-2 border border-gray2 text-left">
                          {stock.standardCount}
                        </td>
                        <td className="px-2 py-2 border border-gray2 text-left">
                          {stock.nonStandardLengths.join(' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Manage;

import React, { useState, useEffect } from 'react';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

const Manage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
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

        console.log(response);
        setCurrentStock(response.data.data);
      } catch (error) {
        console.log(error);
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
          <div className="flex flex-col mb-12">
            {currentStock.length == 0 ? (
              <div className="flex justify-center items-center mt-24">
                <span>현재 재고 수량이 없습니다.</span>
              </div>
            ) : (
              <>
                <span className="text-lg text-left font-bold mb-4">
                  현재 재고 수량
                </span>
                <table className="min-w-full border border-gray4 border-collapse">
                  <thead>
                    <tr className="border border-gray4 text-left">
                      <th className="px-2 py-3 border border-gray4">폭</th>
                      <th className="px-2 py-3 border border-gray4">
                        정단(120yd) 개수
                      </th>
                      <th className="px-2 py-3 border border-gray4">
                        비정단(120yd 외) 길이별 개수
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStock.map((stock, index) => (
                      <tr key={index} className="border border-gray4">
                        <td className="px-2 py-2 border border-gray4 text-left">
                          {stock.typeWidth}
                        </td>
                        <td className="px-2 py-2 border border-gray4 text-left">
                          {stock.standardCount}
                        </td>
                        <td className="px-2 py-2 border border-gray4 text-left">
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

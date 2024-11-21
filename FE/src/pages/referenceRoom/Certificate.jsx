import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import resengLogo from '../../assets/reseng_logo.png';

const Cerificate = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();
  const role = localStorage.getItem('role');

  const [certificate, setCertificate] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/documents/CERTIFICATE?page=0&size=10`
        );

        console.log(response);
        console.log(response.data.data.content);

        const data = response.data.data.content;
        setCertificate(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          <SubNavbar
            items={navItems}
            activePage="인증서"
            mainCategory="자료실"
          />
          {/* 메인 */}
          <div className="flex flex-col mb-12">
            <div className="flex flex-wrap w-full justify-center">
              {certificate.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-2/7 items-center px-6 py-8 border border-gray3 rounded-lg mx-4 my-2"
                >
                  {/* 이미지 영역 */}
                  <div className="flex justify-center items-center h-36">
                    <img
                      className="max-w-full max-h-full object-contain"
                      src={item.thumbnailUrl || resengLogo}
                      alt={item.title}
                    />
                  </div>
                  {/* 텍스트 영역 */}
                  <div className="w-full mt-4 text-center">
                    <span className="text-lg font-bold">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
            {role === 'ROLE_MANAGER' && (
              <div className="flex justify-end mt-12 mb-12">
                <button
                  type="submit"
                  onClick={() =>
                    navigateTo(routes.documentRegister, {
                      documentType: 'CERTIFICATE',
                    })
                  }
                  className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                >
                  글쓰기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cerificate;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import resengLogo from '../../assets/reseng_logo.png';

const Coa = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();
  const role = localStorage.getItem('role');

  const [coa, setCoa] = useState([]);

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/documents/GRADE?page=0&size=10`
        );

        console.log(response);
        console.log(response.data.data.content);

        const data = response.data.data.content;
        setCoa(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFaqData();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          <SubNavbar
            items={navItems}
            activePage="성적서"
            mainCategory="자료실"
          />
          {/* 메인 */}
          <div className="flex flex-col mb-12">
            <div
              className="flex flex-wrap w-full justify-center"
              // onClick={() => navigateTo(routes.coaDetail)}
            >
              {coa.map((item) => (
                // <div
                //   key={item.id}
                //   className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-1/3 justify-center items-center mx-8"
                // >
                // <div className="flex justify-center items-center border border-gray3 rounded-lg">
                <>
                  <div
                    key={item.id}
                    className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-2/7 items-center py-8 my-2 mx-2"
                  >
                    {/* 이미지 영역 */}
                    <div className="flex justify-center items-center w-5/6 h-96 border border-gray3 rounded-lg px-8 py-8 mt-4">
                      <img
                        className="w-full max-h-full object-contain"
                        src={item.thumbnailUrl || resengLogo}
                        alt={item.title}
                      />
                    </div>
                    {/* 텍스트 영역 */}
                    <div className="w-full mt-4 text-center">
                      <span className="text-xl font-bold">{item.title}</span>
                    </div>
                  </div>
                </>
              ))}
            </div>
            {role === 'ROLE_MANAGER' && (
              <div className="flex justify-end mt-12 mb-12">
                <button
                  type="submit"
                  onClick={() =>
                    navigateTo(routes.documentRegister, {
                      documentType: 'GRADE',
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

export default Coa;

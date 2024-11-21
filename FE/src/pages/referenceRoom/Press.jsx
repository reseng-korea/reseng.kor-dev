import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import resengLogo from '../../assets/reseng_logo.png';

const Press = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();

  const role = localStorage.getItem('role');

  const [press, setPress] = useState([]);

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/documents/NEWS?page=0&size=10`
        );

        console.log(response);
        console.log(response.data.data.content);

        const data = response.data.data.content;
        setPress(data);
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
            activePage="보도 자료"
            mainCategory="자료실"
          />
          {/* 메인 */}
          <div className="flex flex-col mb-12">
            <div className="flex flex-wrap w-full justify-center">
              {press.map((item) => (
                <div
                  // onClick={() => navigateTo(routes.pressDetail)}
                  key={item.id}
                  className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-1/4 justify-center items-center mx-2 my-4"
                >
                  {/* 이미지 영역 */}
                  <div className="flex justify-center items-center mt-4 h-48 w-5/6 overflow-hidden">
                    <img
                      className="h-full w-full object-cover rounded-lg"
                      src={item.thumbnailUrl || resengLogo}
                      alt={item.title}
                    />
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex flex-col items-start mt-4 w-5/6 overflow-hidden">
                    {/* <div className="flex flex-col items-start w-full px-2 mt-4"> */}
                    <span className="text-left text-lg font-bold flex-grow">
                      {item.title}
                    </span>
                    <span className="text-sm text-gray3 mt-1">{item.date}</span>
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
                      documentType: 'NEWS',
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

export default Press;

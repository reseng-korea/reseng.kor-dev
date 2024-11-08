import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import KakaoMap from '../../components/Map/KakaoMap';

import location from '../../assets/location.png';
import { FaHome } from 'react-icons/fa';
import { IoIosCall } from 'react-icons/io';

import { tmplocationdata } from '../../data/tmplocationdata';

const Location = () => {
  const navItems = [
    { label: '회사 소개', route: '/company' },
    { label: '연혁', route: '/history' },
    { label: '오시는 길', route: '/location' },
  ];

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/v1/companies`, {
          params: {
            page: 0,
            size: 10,
          },
        });
        console.log(response);
        console.log('서버로부터 받은 데이터:', response.content);
        setCompanies(response.data); // 서버에서 받은 데이터 저장
      } catch (err) {
        setError(err.message); // 에러 메시지 저장
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="오시는 길"
            mainCategory="회사 소개"
          />
          {/* A 구역: 업체 목록 */}
          {/* api 연결하면 데이터 가져와서 바로 넣어주면 될듯(지금은 더미데이터) */}

          <div className="flex flex-col">
            {/* 소개 */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden">
              <img
                className="w-full h-full object-cover rounded-2xl animate-zoom-in"
                src={location}
                alt="친환경 여정 이미지"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-center text-lg font-bold text-white sm:text-lg md:text-xl lg:text-3xl fade-in">
                  <span className="block mb-2">
                    본사와 전국 5개의 총판을 통해
                  </span>
                  서비스를 제공하고 있습니다.
                </span>
              </div>
            </div>
            {/* 업체 목록 및 사진 */}
            <div
              className="flex gap-x-6 mt-12 mb-12"
              style={{ height: 'calc(100vh - 230px)' }}
            >
              <div
                className="w-1/3 p-4 rounded-2xl shadow-even slide-down"
                style={{ height: '100%' }}
              >
                <div className="flex flex-col h-full">
                  <h1 className="m-8 text-sm font-bold sm:text-lg lg:text-2xl">
                    업체 목록
                  </h1>
                  <div className="flex-grow px-2 overflow-y-auto">
                    {tmplocationdata.map((item, index) => (
                      <div
                        key={index}
                        className="p-6 mt-4 mb-6 text-left bg-white shadow-even rounded-2xl hover:bg-placeHolder hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between mb-4">
                          <p className="p-2 mb-2 text-[10px] font-bold sm:text-sm md:text-lg lg:text-xl">
                            {item.name}
                          </p>
                          <p
                            className={`p-2 mb-2 text-md text-white font-bold rounded-lg
                            ${item.type === '본사' ? 'bg-primary' : 'bg-re'} `}
                          >
                            {item.type}
                          </p>
                        </div>
                        {/* <hr className="mb-5" /> */}
                        <div className="flex justify-center px-2 space-x-2">
                          {/* <p className="mr-1 mb-1 text-[10px] flex-shrink-0 sm:text-sm">
                          주소 :
                        </p> */}
                          <FaHome className="text-gray3" />
                          <p className="mb-1 text-[10px] flex-grow sm:text-sm">
                            {item.address}
                          </p>
                        </div>
                        <div className="flex justify-center items-center px-2 space-x-2">
                          {/* <p className="mr-1 mb-1 text-[10px] flex-shrink-0 sm:text-sm">
                          전화 :
                        </p> */}
                          <IoIosCall className="text-gray3" />
                          <p className="mb-1 text-[10px] flex-grow sm:text-sm">
                            {item.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* B 구역: 지도 */}
              {/* 목록들 가져와서 지도에 마커로 뿌리기 */}
              {/* 본사, 총판, 대리점의 마커 색을 다르게 해야할까 고민 */}
              {/* 마커 띄울 때 이름도 띄워야할 지에 대해서도 고민 */}
              <div className="w-2/3 move-left">
                <KakaoMap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Location;

import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import datePicker from '../../assets/date_picker.png';

import useModal from '../../hooks/useModal';

const Qr = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const [selectOptions, setSelectOptions] = useState([]);

  const [clientName, setClientName] = useState(''); //고객명
  const [postedLocation, setPostedLocation] = useState(''); //게시 장소
  const [requestedDate, setRequestedDate] = useState(''); //요청 날짜
  const [postedDate, setPostedDate] = useState(''); //게시 날짜
  const [postedDuration, setPostedDuration] = useState(''); //게시 기간
  const [typeWidth, setTypeWidth] = useState(null); //사용 현수막
  const [horizontalLength, setHorizontalLength] = useState(''); //가로 길이
  const [requestedLength, setRequestedLength] = useState(''); //사용할 길이

  const [selectedDate, setSelectedDate] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);

  // typeWidth 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${apiUrl}/api/v1/inventory`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response);

        const options = response.data.data
          .filter((item) => item.typeWidth !== undefined)
          .map((item) => ({
            value: item.typeWidth,
            label: `${item.typeWidth}mm`,
          }));

        setSelectOptions(options); // 상태 업데이트
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleSearchTypeWidth = async () => {
    console.log(typeWidth);
    try {
      const response = await apiClient.get(
        `${apiUrl}/api/v1/inventory/${typeWidth}`,
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

  const handleSubmit = async () => {
    try {
      const response = await apiClient.get(
        `${apiUrl}/api/v1/inventory/${typeWidth}`,
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

    const data = {
      clientName: '유재석',
      postedLocation: '관저로',
      requestedDate: '2024-11-02',
      postedDate: '2024-11-13',
      postedDuration: 1,
      typeWidth: 1500,
      horizontalLength: 98,
      requestedLength: 20,
    };

    try {
      const response = await apiClient.post(`${apiUrl}/api/v1/qr-code`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });

      console.log(response);

      // Blob 객체 생성
      const blob = new Blob([response.data], { type: 'image/png' });

      // Blob을 URL로 변환
      const url = URL.createObjectURL(blob);

      setImageUrl(url); // 상태로 URL 저장
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
            activePage="QR 발생기"
            mainCategory="마이페이지"
          />
          {/* 메인 */}
          <div className="flex flex-col px-4 py-4 border border-gray3">
            {/* 폭 설정 */}
            <div className="flex flex-col">
              <span className="text-lg font-bold">폭 설정</span>
              <div className="flex flex-col">
                <div className="flex mt-4 justify-center space-x-2">
                  <Select
                    options={selectOptions}
                    value={typeWidth}
                    onChange={(selectedOption) => setTypeWidth(selectedOption)}
                    placeholder="폭을 선택해주세요"
                    // isClearable
                    className="w-1/3"
                  />
                  <button
                    type="submit"
                    onClick={handleSearchTypeWidth}
                    className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                  >
                    검색
                  </button>
                </div>
              </div>
            </div>
            {/* 사용 가능한 현수막에 대한 추가 설정 */}
            <div className="flex flex-col">
              <div className="flex justify-center space-x-2 mt-4 text-left">
                <div className="flex flex-col w-1/4 px-3 py-2 text-left">
                  <span className="text-lg font-bold">사용 현수막</span>
                  <div className="flex items-center py-2 space-x-2">
                    <select className="w-full p-2 border border-gray3">
                      <option value="">105yard</option>
                      <option value="800m">100yard</option>
                      <option value="900m">90yard</option>
                      <option value="1300m">80yard</option>
                      <option value="1400m">75yard</option>
                      <option value="1700m">30yard</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col w-1/4 px-3 py-2">
                  <span className="text-lg font-bold">사용할 길이</span>
                  <div className="flex items-center py-2 space-x-2">
                    <input
                      className="w-full p-2 border border-gray3"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-1/4 px-3 py-2">
                  <span className="text-lg font-bold">고객명</span>
                  <div className="flex items-center py-2 space-x-2">
                    <input
                      className="w-full p-2 border border-gray3"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-2 mt-4 text-left">
                <div className="flex flex-col w-1/4 px-3 py-2">
                  <span className="text-lg font-bold">게시 장소</span>
                  <div className="flex items-center py-2 space-x-2">
                    <input
                      className="w-full p-2 border border-gray3"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-1/4 px-3 py-2">
                  <span className="text-lg font-bold mb-2">요청 날짜</span>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Select a date"
                    className="w-full px-4 py-2 border border-gray3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    popperClassName="border border-gray3 shadow-lg bg-white"
                  />
                </div>
                <div className="flex flex-col w-1/4 px-3 py-2">
                  <span className="text-lg font-bold mb-2">게시 날짜</span>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Select a date"
                    className="w-full px-4 py-2 border border-gray3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    popperClassName="border border-gray3 shadow-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                >
                  QR 발생하기
                </button>
              </div>
            </div>
          </div>
          {/* QR 발생 칸 */}
          <div className="min-h-48 mt-12 border border-gray3">
            {imageUrl && <img src={imageUrl} alt="QR Code" />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Qr;

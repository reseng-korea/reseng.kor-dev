import React, { useState } from 'react';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import datePicker from '../../assets/date_picker.png';

const Qr = () => {
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user/edit' },
  ];

  const [selectedDate, setSelectedDate] = useState(null);

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
                  <select className="w-1/2 p-2 border border-gray3">
                    <option value="">폭</option>
                    <option value="800m">800m</option>
                    <option value="900m">900m</option>
                    <option value="1300m">1300m</option>
                    <option value="1400m">1400m</option>
                    <option value="1700m">1700m</option>
                  </select>
                  <button
                    type="submit"
                    className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
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
                  className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
                >
                  QR 발생하기
                </button>
              </div>
            </div>
          </div>
          {/* QR 발생 칸 */}
          <div className="min-h-48 mt-12 border border-gray3">
            <span>QR 나오는 칸</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Qr;

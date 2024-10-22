import Layout from '../../components/Layouts';
import React, { useState } from 'react';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { regionsData } from './../data/regionsData';

import reset from '../../assets/member_reset.png';
import { memberData } from '../data/memberData';

const Member = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  // 관리 영역 설정에서 '관리 영역만'을 default 값으로 설정
  const [selectedOption, setSelectedOption] = useState('manage');

  const [selectedMetropolitan, setSelectedMetropolitan] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleMetropolitanChange = (e) => {
    setSelectedMetropolitan(e.target.value);
    setSelectedDistrict('');
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // 업체 목록 테이블
  const [isTableVisible, setIsTableVisible] = useState(false);

  const handleLookUp = () => {
    setIsTableVisible((prev) => !prev);
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          {/* 하위 카테고리 */}
          <div className="mt-16 mb-6 text-3xl font-bold">마이페이지</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.mypageMember)}
              className="flex items-center justify-center h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">업체 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageManage)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">현수막 관리</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageOrder)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">현수막 발주</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageQr)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">QR 발생기</span>
            </button>
            <button
              onClick={() => navigateTo(routes.mypageUser)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">회원 정보 수정</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />
          {/* 메인 */}
          <div>
            {/* 설정 창 */}
            <div className="flex flex-col border border-gray3 px-4 py-4">
              {/* 설정하는 곳 */}
              <div className="flex mb-2 text-left">
                {/* 지역 설정 */}
                <div className="flex flex-col px-3 py-2 w-2/5">
                  <span className="text-lg font-bold">지역 설정</span>
                  <div className="flex items-center py-2 space-x-2">
                    <select
                      className="w-1/2 p-2 mb-1 border border-gray3"
                      value={selectedMetropolitan}
                      onChange={handleMetropolitanChange}
                    >
                      <option value="">광역자치구</option>
                      {Object.keys(regionsData).map((metropolitan) => (
                        <option key={metropolitan} value={metropolitan}>
                          {metropolitan}
                        </option>
                      ))}
                    </select>
                    <select
                      className="w-1/2 p-2 mb-1 border border-gray3"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedMetropolitan}
                    >
                      <option value="">지역자치구</option>
                      {selectedMetropolitan &&
                        regionsData[selectedMetropolitan].map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                {/* 롤 설정 */}
                <div className="flex flex-col w-1/5 px-3 py-2">
                  <span className="text-lg font-bold">롤 설정</span>
                  <div className="flex items-center py-2 space-x-2">
                    <select className="w-full p-2 border border-gray3">
                      <option value="">유저롤</option>
                      <option value="admin">관리자</option>
                      <option value="distributor">총판</option>
                      <option value="agency">대리점</option>
                      <option value="consumer">소비자</option>
                      <option value="guest">게스트</option>
                    </select>
                  </div>
                </div>
                {/* 업체명 설정 */}
                <div className="flex flex-col w-1/5 px-3 py-2">
                  <span className="text-lg font-bold">업체명 설정</span>
                  <div className="flex items-center py-2 space-x-2">
                    <input
                      className="w-full p-2 border border-gray3"
                      type="text"
                      placeholder="업체명"
                    />
                  </div>
                </div>
                {/* 관리 영역 설정 */}
                <div className="flex flex-col w-1/5 px-3 py-2">
                  <span className="text-lg font-bold">관리 영역 설정</span>
                  <div className="flex items-center py-2 space-x-2">
                    <label>
                      <input
                        type="radio"
                        value="manage"
                        checked={selectedOption === 'manage'}
                        onChange={handleOptionChange}
                      />
                      관리영역만
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="all"
                        checked={selectedOption === 'all'}
                        onChange={handleOptionChange}
                      />
                      전체
                    </label>
                  </div>
                </div>
              </div>
              {/* 조회 버튼 칸 */}
              <div>
                <div className="justify-end items-center flex space-x-3">
                  <div className="flex space-x-1 items-center cursor-pointer">
                    <img src={reset} className="w-4 h-4" />
                    <span className="text-gray3 text-sm">초기화</span>
                  </div>
                  <button
                    onClick={handleLookUp}
                    type="submit"
                    className="px-4 py-1.5 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
                  >
                    조회하기
                  </button>
                </div>
              </div>
            </div>
            {/* 결과 조회 */}
            <div className="flex flex-col w-full">
              <span className="text-left text-xl font-bold mt-4 mb-2">
                업체 목록
              </span>
              <div className="flex flex-col min-h-32 items-center justify-center border border-gray3">
                {/* 조회 결과가 없을 경우 */}
                {/* <span className="items-center justify-center">
                  조회 결과가 없습니다.
                </span> */}
                {isTableVisible ? (
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray2">
                        <th className="py-3">관리 여부</th>
                        <th className="py-3">회사</th>
                        <th className="py-3">위치</th>
                        <th className="py-3">회사 번호</th>
                        <th className="py-3">회사 팩스</th>
                        <th className="py-3">핸드폰 번호</th>
                        <th className="py-3">광역자치구</th>
                        <th className="py-3">지역자치구</th>
                        <th className="py-3">유저 롤</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberData.map((company) => (
                        <tr key={company.id}>
                          <td
                            className={`py-2 text-sm ${company.managementStatus == '관리' ? 'text-primary font-bold' : 'text-warning'}`}
                          >
                            {company.managementStatus}
                          </td>
                          <td className="py-3 text-sm">
                            {company.companyName}
                          </td>
                          <td className="py-2 text-sm">{company.location}</td>
                          <td className="py-2 text-sm">
                            {company.companyPhone}
                          </td>
                          <td className="py-2 text-sm">{company.companyFax}</td>
                          <td className="py-2 text-sm">
                            {company.mobilePhone}
                          </td>
                          <td className="py-2 text-sm">
                            {company.metropolitanArea}
                          </td>
                          <td className="py-2 text-sm">{company.localArea}</td>
                          <td className="py-2 text-sm">{company.userRole}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-2 text-sm">조회 결과가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Member;

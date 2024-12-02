import React, { useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { regionsData } from '../../data/regionsData';

import reset from '../../assets/member_reset.png';
// 여기부터
// 역할 체계 상수 추가
const ROLE_HIERARCHY = {
  ROLE_MANAGER: 4,
  ROLE_DISTRIBUTOR: 3,
  ROLE_AGENCY: 2,
  ROLE_CUSTOMER: 1,
  ROLE_GUEST: 0
};

const ROLE_NAMES = {
  ROLE_MANAGER: "관리자",
  ROLE_DISTRIBUTOR: "총판",
  ROLE_AGENCY: "대리점",
  ROLE_CUSTOMER: "소비자",
  ROLE_GUEST: "일반회원"
};
// 여기까지

const Member = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

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
  
  // 업체명 입력을 위한 상태 추가
  const [companyName, setCompanyName] = useState('');
  
  // 유저 롤 선택을 위한 상태 추가
  const [selectedRole, setSelectedRole] = useState("DEFAULT");

  // 유저 롤 변경을 위한 상태 추가
  const [editRole, setEditRole] = useState(role);

  // 조회 결과를 저장할 상태 수정
  const [memberList, setMemberList] = useState([]);

  // 역할 변경 핸들러
  const handleRoleEdit = async (e, userId) => {
    try {
      const newRole = e.target.value;

      const requestBody = {
        targetUserId: userId,
        targetRole: newRole
      };
      console.log(requestBody);

      const ment = newRole === "ROLE_GUEST" ? "해당 역할을 해제하시겠습니까?" : "해당 역할을 부여하시겠습니까?";

      if (window.confirm(ment)) {
        const response = await axios.patch(
          `${apiUrl}/api/v1/users/roles`,
          requestBody,
          {
            headers: {
              Authorization: accesstoken,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.code === 200) {
          console.log("역할 변경 성공");
          handleLookUp();
        }
      }
    } catch (error) {
      console.error('역할 변경 중 오류 발생:', error);
    }
  };

  // 사용 가능한 역할 옵션 생성 함수
  const getAvailableRoles = (currentRole) => {
    const myRoleLevel = ROLE_HIERARCHY[role];
    const currentRoleLevel = ROLE_HIERARCHY[currentRole];
    
    // GUEST보다 상위 역할인 경우
    if (currentRoleLevel > ROLE_HIERARCHY.ROLE_GUEST) {
      return [
        { value: currentRole, label: ROLE_NAMES[currentRole] },
        { value: "ROLE_GUEST", label: "해제" }
      ];
    }
    
    // GUEST인 경우, 내 역할 이하의 모든 역할 표시
    return Object.entries(ROLE_HIERARCHY)
      .filter(([role, level]) => level <= myRoleLevel)
      .map(([role]) => ({
        value: role,
        label: ROLE_NAMES[role]
      }));
  };

  // handleLookUp 함수 수정
  const handleLookUp = async () => {
    try {
      // 쿼리 파라미터 구성
      const params = new URLSearchParams();
      
      if (selectedMetropolitan) params.append('city', selectedMetropolitan);
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (selectedRole !== 'DEFAULT') params.append('role', selectedRole);
      if (companyName) params.append('companyName', companyName);
      if (selectedOption) params.append('scope', selectedOption);

      const response = await axios.get(
        `${apiUrl}/api/v1/users/pagination?${params}`,
        {
          headers: {
            Authorization: accesstoken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.code === 200) {
        if (response.data.data.totalCount > 0) {
          setMemberList(response.data.data.userList);
          setIsTableVisible(true);
        } else {
          setIsTableVisible(false);
          setMemberList([]);
        }
      }
    } catch (error) {
      console.error('조회 중 오류 발생:', error);
      setIsTableVisible(false);
      setMemberList([]);
    }
  };

  // 업체명 입력 핸들러 추가
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  // 유저 롤 선택 핸들러 추가
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="업체 관리"
            mainCategory="마이페이지"
          />
          {/* 메인 */}
          <div>
            {/* 설정 창 */}
            <div className="flex flex-col border border-gray3 px-4 py-4">
              {/* 설정하는 곳 */}
              <div className="flex mb-2 text-left">
                {/* 지역 설정 */}
                <div className="flex flex-col w-2/5 px-3 py-2">
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
                    <select 
                      className="w-full p-2 border border-gray3"
                      value={selectedRole}
                      onChange={handleRoleChange}
                    >
                      <option value="DEFAULT">유저롤</option>
                      <option value="ROLE_MANAGER">관리자</option>
                      <option value="ROLE_DISTRIBUTOR">총판</option>
                      <option value="ROLE_AGENCY">대리점</option>
                      <option value="ROLE_CUSTOMER">소비자</option>
                      <option value="ROLE_GUEST">게스트</option>
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
                      value={companyName}
                      onChange={handleCompanyNameChange}
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
                      {memberList.map((company) => (
                        <tr key={company.userId}>
                          <td
                            className={`py-2 text-sm ${company.status ? 'text-primary font-bold' : 'text-warning'}`}
                          >
                            {company.status ? "관리" : "미관리"}
                          </td>
                          <td className="py-3 text-sm">
                            {company.companyName}
                          </td>
                          <td className="py-2 text-sm">{company.detailAddress}</td>
                          <td className="py-2 text-sm">
                            {company.companyPhoneNumber}
                          </td>
                          <td className="py-2 text-sm">
                            {company.faxNumber}
                          </td>
                          <td className="py-2 text-sm">
                            {company.phoneNumber}
                          </td>
                          <td className="py-2 text-sm">
                            {company.city}
                          </td>
                          <td className="py-2 text-sm">{company.district}</td>
                          <td className="py-2 text-sm">
                            <select
                              className="p-2 border border-gray3"
                              value={company.role}
                              onChange={(e) => handleRoleEdit(e, company.userId)}
                            >
                              {getAvailableRoles(company.role).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
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
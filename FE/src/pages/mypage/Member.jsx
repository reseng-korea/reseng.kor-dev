import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import Pagination from 'react-js-pagination';
import { useSearchParams } from 'react-router-dom';

import apiClient from '../../services/apiClient';
import useModal from '../../hooks/useModal';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { MdAutorenew } from 'react-icons/md';

const ROLE_HIERARCHY = {
  ROLE_MANAGER: 4,
  ROLE_DISTRIBUTOR: 3,
  ROLE_AGENCY: 2,
  ROLE_CUSTOMER: 1,
  ROLE_GUEST: 0,
};

const ROLE_NAMES = {
  ROLE_MANAGER: '관리자',
  ROLE_DISTRIBUTOR: '총판',
  ROLE_AGENCY: '대리점',
  ROLE_CUSTOMER: '소비자',
  ROLE_GUEST: '일반회원',
};

const roleOptions = [
  { value: 'ROLE_MANAGER', label: '관리자' },
  { value: 'ROLE_DISTRIBUTOR', label: '총판' },
  { value: 'ROLE_AGENCY', label: '대리점' },
  { value: 'ROLE_CUSTOMER', label: '소비자' },
  { value: 'ROLE_GUEST', label: '일반회원' },
];

const getRoleOptions = (role) => {
  if (role === 'ROLE_GUEST') {
    return [
      { value: 'ROLE_CUSTOMER', label: '소비자' },
      { value: 'ROLE_GUEST', label: '일반회원' },
    ];
  }
  return [
    { value: 'ROLE_DISTRIBUTOR', label: '총판' },
    { value: 'ROLE_AGENCY', label: '대리점' },
    { value: 'ROLE_CUSTOMER', label: '소비자' },
    { value: 'ROLE_GUEST', label: '일반회원' },
  ];
};

const customStyles = {
  control: (provided) => ({
    ...provided,
    display: 'flex',
    justifyContent: 'center', // 수평 중앙 정렬
    alignItems: 'center', // 수직 중앙 정렬
    width: '100px', // 너비 설정
    height: '40px', // 높이 설정
    margin: '0 auto', // 부모 기준으로 중앙 정렬
    border: '1px solid #ccc', // 기본 테두리
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: 'flex',
    justifyContent: 'center', // 선택된 값 중앙 정렬
    alignItems: 'center', // 선택된 값 수직 중앙 정렬
    padding: '0px', // 불필요한 여백 제거
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    display: 'flex',
    justifyContent: 'center', // 드롭다운 아이콘 중앙 정렬
    alignItems: 'center', // 드롭다운 아이콘 수직 중앙 정렬
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'flex',
    justifyContent: 'center', // 텍스트 수평 중앙 정렬
    alignItems: 'center', // 텍스트 수직 중앙 정렬
    textAlign: 'center', // 텍스트를 중앙에 정렬
  }),
};

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

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  // 광역자치구, 지역자치구 불러오기
  const [regionsData, setRegionsData] = useState([]);
  const [subRegionsData, setSubRegionsData] = useState([]);
  // 자신보다 낮은 등급의 롤만 설정 가능
  const [filteredRoles, setFilteredRoles] = useState(roleOptions);
  // 광역자치구
  const [selectedRegion, setSelectedRegion] = useState(null);
  // 지역자치구
  const [selectedSubRegion, setSelectedSubRegion] = useState(null);
  // 유저 롤 선택을 위한 상태 추가
  const [selectedRole, setSelectedRole] = useState([]);
  // 업체명 입력을 위한 상태 추가
  const [companyName, setCompanyName] = useState('');
  // 관리 영역 설정에서 '관리 영역만'을 default 값으로 설정
  const [selectedOption, setSelectedOption] = useState('MANAGE');
  // 조회 결과를 저장할 상태 수정
  const [memberList, setMemberList] = useState([]);
  // 업체 목록 테이블
  const [isTableVisible, setIsTableVisible] = useState(false);

  // 유저 롤 변경을 위한 상태 추가
  // const [editRole, setEditRole] = useState(role);

  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = parseInt(searchParams.get('page')) || 1;
  const itemsCountPerPage = 10;

  const memberSectionRef = useRef(null);

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber }); // 페이지 번호를 URL 쿼리 파라미터에 설정
  };

  // 페이지 로드 시 광역자치구 불러오기
  useEffect(() => {
    async function loadRegionsData() {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/regions/cities`);
        const regions = response.data.data.map((item) => ({
          value: item.id,
          label: item.regionName,
        }));
        setRegionsData(regions);
      } catch (error) {
        // console.log(error);
      }
    }
    loadRegionsData();
  }, [apiUrl]);

  // 광역자치구가 변경될 때마다 지역자치구 불러오기
  useEffect(() => {
    async function loadSubRegions() {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            `${apiUrl}/api/v1/regions/${selectedRegion.value}/districts`
          );
          const subRegions = response.data.data.map((item) => ({
            value: item.id,
            label: item.regionName,
          }));
          setSubRegionsData(subRegions);
        } catch (error) {
          // console.log(error);
        }
      } else {
        setSubRegionsData([]); // region이 없으면 하위 지역 초기화
      }
    }

    loadSubRegions();
  }, [selectedRegion, apiUrl]);

  // 페이지 로드 시 롤 불러오기
  useEffect(() => {
    const currentRole = localStorage.getItem('role');
    const currentRoleLevel = ROLE_HIERARCHY[currentRole];

    // roleOptions를 필터링하여 현재 역할 이하의 항목만 남기기
    const allowedRoles = roleOptions.filter(
      (role) => ROLE_HIERARCHY[role.value] <= currentRoleLevel
    );

    setFilteredRoles(allowedRoles);
  }, []);

  // 페이지네이션
  useEffect(() => {
    if (memberList.length > 0) {
      handleLookUp();
    }
  }, [activePage]);

  // 업체명 입력 핸들러 추가
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  // 관리 영역 선택 핸들러
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // 조회하기 클릭 시 스크롤 이동(업체 목록 보이도록)
  useEffect(() => {
    if (isTableVisible && memberSectionRef.current) {
      memberSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [memberList, isTableVisible]);

  // 조회하기 클릭
  const handleLookUp = async () => {
    try {
      // 쿼리 파라미터 구성
      const params = new URLSearchParams();

      if (selectedRegion?.label) params.append('city', selectedRegion.label);
      if (selectedSubRegion?.label)
        params.append('district', selectedSubRegion.label);
      if (selectedRole?.value) params.append('role', selectedRole.value);
      if (companyName) params.append('companyName', companyName);
      if (selectedOption) params.append('manage', selectedOption);

      const response = await apiClient.get(
        `${apiUrl}/api/v1/users/pagination?page=${activePage - 1}&${params}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log(response);

      if (response.data.code === 200) {
        setIsTableVisible(true);
        if (response.data.data.totalCount > 0) {
          setTotalElements(response.data.data.totalCount);
          setMemberList(response.data.data.userList);
        } else {
          setMemberList([]);
        }
      }
    } catch (error) {
      console.error('조회 중 오류 발생:', error);
      // console.log(error);
      setIsTableVisible(false);
      setMemberList([]);
    }
  };

  // 초기화 클릭
  const handleReset = () => {
    setSelectedRegion(null);
    setSelectedSubRegion(null);
    setSelectedRole('default');
    setCompanyName('');
    setSelectedOption('manage');
  };

  // 핸드폰 번호 (-) 추가
  const formatPhoneNumber = (number) => {
    return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  // 역할 변경 핸들러
  const handleRoleEdit = async (
    childId,
    companyName,
    selectedValue,
    optionsLength
  ) => {
    // 게스트 -> 소비자
    if (optionsLength == 2) {
      openModal({
        primaryText: `${companyName}의 역할을`,
        secondaryText: `'소비자'로 변경하시겠습니까?`,
        type: 'success',
        isAutoClose: false,
        cancleButton: true,
        onConfirm: async () => {
          closeModal();
          try {
            const response = await apiClient.put(
              `${apiUrl}/api/v1/role/hierarchy/guest/to/customer/${childId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            // console.log(response);

            // 성공하면
            openModal({
              primaryText: `${companyName}의 역할이 성공적으로`,
              secondaryText: `소비자로 변경되었습니다.`,
              type: 'success',
              isAutoClose: false,
              onConfirm: async () => {
                closeModal();
                handleLookUp();
              },
            });
          } catch (error) {
            // console.log(error);
            openModal({
              primaryText: `${companyName}"의 역할 변경 중 오류가`,
              secondaryText: `발생했습니다. 잠시 후 다시 시도해 주세요.`,
              context: '문제가 지속되면 관리자에게 문의해 주세요.',
              type: 'warning',
              isAutoClose: false,
              onConfirm: async () => {
                closeModal();
              },
            });
          }
        },
        onCancel: () => {
          closeModal();
        },
      });
    } else {
      // 롤 변경
      const requestBody = {
        targetUserId: childId,
        targetRole: selectedValue,
      };

      openModal({
        primaryText: `${companyName}의 역할을`,
        secondaryText: `'${ROLE_NAMES[selectedValue]}'(으)로 변경하시겠습니까?`,
        type: 'success',
        isAutoClose: false,
        cancleButton: true,
        onConfirm: async () => {
          closeModal();
          try {
            const response = await apiClient.patch(
              `${apiUrl}/api/v1/users/roles`,
              requestBody,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            // console.log(response);

            // 성공하면
            openModal({
              primaryText: `${companyName}의 역할이 성공적으로`,
              secondaryText: `'${ROLE_NAMES[selectedValue]}'(으)로 변경되었습니다.`,
              type: 'success',
              isAutoClose: false,
              onConfirm: async () => {
                closeModal();
                handleLookUp();
              },
            });
          } catch (error) {
            // console.log(error);

            if (
              error.response.data.code == 6001 ||
              error.response.data.code == 6004
            ) {
              openModal({
                primaryText: `${companyName}의 등급을 변경할 권리가 없습니다.`,
                type: 'warning',
                isAutoClose: false,
                onConfirm: async () => {
                  closeModal();
                },
              });
            } else {
              openModal({
                primaryText: `${companyName}의 역할 변경 중 오류가`,
                secondaryText: `발생했습니다. 잠시 후 다시 시도해 주세요.`,
                context: '문제가 지속되면 관리자에게 문의해 주세요.',
                type: 'warning',
                isAutoClose: false,
                onConfirm: async () => {
                  closeModal();
                },
              });
            }
          }
        },
        onCancel: () => {
          closeModal();
        },
      });
    }

    // try {
    //   const newRole = e.target.value;

    //   const requestBody = {
    //     targetUserId: userId,
    //     targetRole: newRole,
    //   };
    //   console.log(requestBody);

    //   const ment =
    //     newRole === 'ROLE_GUEST'
    //       ? '해당 역할을 해제하시겠습니까?'
    //       : '해당 역할을 부여하시겠습니까?';

    //   if (window.confirm(ment)) {
    //     const response = await apiClient.patch(
    //       `${apiUrl}/api/v1/users/roles`,
    //       requestBody,
    //       {
    //         headers: {
    //           Authorization: accesstoken,
    //           'Content-Type': 'application/json',
    //         },
    //       }
    //     );

    //     if (response.data.code === 200) {
    //       console.log('역할 변경 성공');
    //       handleLookUp();
    //     }
    //   }
    // } catch (error) {
    //   console.error('역할 변경 중 오류 발생:', error);
    // }
  };

  // 사용 가능한 역할 옵션 생성 함수
  const getAvailableRoles = (currentRole) => {
    const myRoleLevel = ROLE_HIERARCHY[role];
    const currentRoleLevel = ROLE_HIERARCHY[currentRole];

    // GUEST보다 상위 역할인 경우
    if (currentRoleLevel > ROLE_HIERARCHY.ROLE_GUEST) {
      return [
        { value: currentRole, label: ROLE_NAMES[currentRole] },
        { value: 'ROLE_GUEST', label: '해제' },
      ];
    }

    // GUEST인 경우, 내 역할 이하의 모든 역할 표시
    return Object.entries(ROLE_HIERARCHY)
      .filter(([role, level]) => level <= myRoleLevel)
      .map(([role]) => ({
        value: role,
        label: ROLE_NAMES[role],
      }));
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
          <div
            className={`flex flex-col justify-${isTableVisible ? 'start' : 'center'} ${isTableVisible ? 'h-auto' : 'h-1/2 slide-down'}`}
          >
            {!isTableVisible && (
              <span className="text-left text-xl font-bold mb-4">
                원하는 조건을 선택하여 업체를 관리하세요.
              </span>
            )}

            {/* 설정 창 */}
            <div
              className={`flex flex-col border border-gray2 rounded-lg px-4 py-4`}
            >
              {/* 설정하는 곳 */}
              <div className="flex mb-2 text-left">
                {/* 지역 설정 */}
                <div className="flex flex-col w-2/5 px-3 py-2">
                  <span className="text-lg font-bold">지역</span>
                  <div className="flex items-center py-2 space-x-2">
                    <Select
                      options={regionsData}
                      value={selectedRegion}
                      onChange={(selectedOption) => {
                        setSelectedRegion(selectedOption);
                        setSelectedSubRegion(null);
                      }}
                      placeholder="광역자치구를 선택해주세요"
                      className="w-1/2 text-xs"
                    />
                    <Select
                      options={subRegionsData}
                      value={selectedSubRegion}
                      onChange={(selectedOption) =>
                        setSelectedSubRegion(selectedOption)
                      }
                      placeholder="지역자치구를 선택해주세요"
                      className="w-1/2 text-xs"
                    />
                  </div>
                </div>
                {/* 롤 설정 */}
                <div className="flex flex-col w-1/5 px-3 py-2">
                  <span className="text-lg font-bold">롤</span>
                  <div className="flex items-center py-2 space-x-2">
                    <Select
                      options={filteredRoles}
                      value={selectedRole}
                      onChange={(selectedOption) =>
                        setSelectedRole(selectedOption)
                      }
                      className="w-full text-xs"
                      placeholder="유저롤을 선택해주세요"
                    />
                  </div>
                </div>
                {/* 업체명 설정 */}
                <div className="flex flex-col w-1/5 px-3 py-2">
                  <span className="text-lg font-bold">업체명</span>
                  <div className="flex items-center py-2 space-x-2">
                    <input
                      className="w-full p-2 border border-gray2 rounded-md text-sm"
                      type="text"
                      placeholder="업체명을 입력해주세요"
                      value={companyName}
                      onChange={handleCompanyNameChange}
                    />
                  </div>
                </div>
                {/* 관리 영역 설정 */}
                <div className="flex flex-col w-1/5 px-3 py-2">
                  <span className="text-lg font-bold">관리 영역</span>
                  <div className="flex items-center py-2 space-x-2">
                    <label>
                      <input
                        type="radio"
                        value="MANAGE"
                        checked={selectedOption === 'MANAGE'}
                        onChange={handleOptionChange}
                      />
                      관리 영역만
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="ALL"
                        checked={selectedOption === 'ALL'}
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
                  <div
                    onClick={handleReset}
                    className="flex space-x-1 items-center cursor-pointer text-gray3 hover:text-gray2"
                  >
                    <MdAutorenew className="text-lg" />
                    <span className="text-sm">초기화</span>
                  </div>
                  <button
                    ref={memberSectionRef}
                    onClick={handleLookUp}
                    type="submit"
                    className="px-4 py-1.5 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                  >
                    조회하기
                  </button>
                </div>
              </div>
            </div>
            {/* 결과 조회 */}
            <div className="flex flex-col w-full">
              {isTableVisible &&
                (memberList.length > 0 ? (
                  <>
                    <span className="text-left text-xl font-bold mt-8 mb-4">
                      업체 목록
                    </span>
                    <div className="flex flex-col min-h-32 items-center justify-center mb-12">
                      <div className="w-full rounded-lg">
                        <table className="min-w-full h-full">
                          <thead>
                            <tr className="border-b border-gray3">
                              <th className="py-4">관리 여부</th>
                              <th className="py-4">회사</th>
                              <th className="py-4">위치</th>
                              <th className="py-4">회사 번호</th>
                              <th className="py-4">회사 팩스</th>
                              <th className="py-4">핸드폰 번호</th>
                              <th className="py-4">광역자치구</th>
                              <th className="py-4">지역자치구</th>
                              <th className="py-4">유저 롤</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberList.map((company) => {
                              const roleOptions = getRoleOptions(company.role);
                              const selectedOption = roleOptions.find(
                                (option) => option.value === company.role
                              );
                              return (
                                <tr
                                  key={company.userId}
                                  className="border-b border-gray1"
                                >
                                  <td
                                    className={`py-2 text-sm ${company.managementStatus ? 'text-primary font-bold' : 'text-warning'}`}
                                  >
                                    {company.managementStatus
                                      ? '관리'
                                      : '미관리'}
                                  </td>
                                  <td className="py-6 text-sm">
                                    {company.companyName}
                                  </td>
                                  <td className="flex flex-col justify-center items-center py-2 text-xs h-full">
                                    <div>{company.streetAddress}</div>
                                    <div>{company.detailAddress}</div>
                                  </td>
                                  <td className="py-2 text-sm">
                                    {company.companyPhoneNumber
                                      ? company.companyPhoneNumber
                                      : '-'}
                                  </td>
                                  <td className="py-2 text-sm">
                                    {company.faxNumber
                                      ? company.faxNumber
                                      : '-'}
                                  </td>
                                  <td className="py-2 text-sm">
                                    {formatPhoneNumber(company.phoneNumber)}
                                  </td>
                                  <td className="py-2 text-sm">
                                    {company.city}
                                  </td>
                                  <td className="py-2 text-sm">
                                    {company.district}
                                  </td>
                                  <td className="py-2 text-sm">
                                    <Select
                                      options={roleOptions}
                                      value={selectedOption}
                                      onChange={(selectedOption) =>
                                        handleRoleEdit(
                                          company.userId,
                                          company.companyName,
                                          selectedOption.value,
                                          getRoleOptions(company.role).length
                                        )
                                      }
                                      styles={customStyles}
                                      className="text-xs text-center"
                                    />
                                    {/* <select
                                      className="p-2 border border-gray3"
                                      value={company.role}
                                      onChange={(e) =>
                                        handleRoleEdit(e, company.userId)
                                      }
                                    >
                                      {getAvailableRoles(company.role).map(
                                        (option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </option>
                                        )
                                      )}
                                    </select> */}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        activePage={activePage} //현재 페이지
                        itemsCountPerPage={itemsCountPerPage} // 페이지 당 항목 수(10개)
                        totalItemsCount={totalElements} // 표시할 항목의 총 개수(전체)
                        pageRangeDisplayed={5} //페이지네이터의 페이지 범위
                        hideFirstLastPages={true}
                        prevPageText="<"
                        nextPageText=">"
                        onChange={handlePageChange}
                        innerClass="flex justify-center mt-4"
                        activeClass="text-white bg-primary rounded-full"
                        activeLinkClass="!text-white hover:!text-white" // 활성화된 페이지 스타일 ( 숫자 부분)
                        itemClass="group inline-block px-4 py-2 border rounded-full text-gray4 mt-4 mx-0.5 hover:text-primary hover:border-primary" // 페이지 번호 스타일
                        linkClass="group-hover:text-primary text-gray4" // 링크의 기본 스타일
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <div className="py-2 text-sm">조회 결과가 없습니다.</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default Member;

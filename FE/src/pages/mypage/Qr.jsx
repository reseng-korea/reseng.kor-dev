import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';

import apiClient from '../../services/apiClient';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import datePicker from '../../assets/date_picker.png';

import useModal from '../../hooks/useModal';
import usePreventRefresh from '../../hooks/usePreventRefresh';

import { FaSearch } from 'react-icons/fa';
import { AiFillExclamationCircle } from 'react-icons/ai';

const Qr = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMouseEnter = () => setIsMenuOpen(true);
  const handleMouseLeave = () => setIsMenuOpen(false);

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const [isOptions, setIsOptions] = useState(false);
  const [typeWidthOptions, setTypeWidthOptions] = useState([]);
  const [horizontalLengthOptions, setHorizontalLengthOptions] = useState([]);

  const [clientName, setClientName] = useState(''); //고객명
  const [postedLocation, setPostedLocation] = useState(''); //게시 장소
  const [requestedDate, setRequestedDate] = useState(''); //요청 날짜
  const [postedDate, setPostedDate] = useState(''); //게시 날짜
  const [postedDuration, setPostedDuration] = useState(''); //게시 기간(일)
  const [typeWidth, setTypeWidth] = useState(null); //사용 현수막
  const [horizontalLength, setHorizontalLength] = useState(0); //가로 길이
  const [serverHorizontalLength, setServerHorizontalLength] = useState(''); //가로 길이(서버 전송 데이터)
  const [requestedLength, setRequestedLength] = useState(''); //사용할 길이
  const [maxRequestedLength, setMaxRequestedLength] = useState(0); // 최대로 사용할 수 있는 길이

  const [imageUrl, setImageUrl] = useState(null);

  const qrSectionRef = useRef(null);

  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const resetStates = () => {
    setClientName('');
    setPostedLocation('');
    setRequestedDate('');
    setPostedDate('');
    setPostedDuration('');
    setHorizontalLength(null);
    setServerHorizontalLength('');
    setRequestedLength('');
  };

  // typeWidth 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`${apiUrl}/api/v1/inventory`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // console.log(response);

        const options = response.data.data
          .filter((item) => item.typeWidth !== undefined)
          .map((item) => ({
            value: item.typeWidth,
            label: `${item.typeWidth}mm`,
          }));

        setTypeWidthOptions(options); // 상태 업데이트
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, []);

  // 폭 선택 후 검색
  const handleSearchTypeWidth = async () => {
    resetStates();
    setIsOptions(false);
    if (!typeWidth) {
      openModal({
        primaryText: '폭을 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    }
    try {
      const response = await apiClient.get(
        `${apiUrl}/api/v1/inventory/${typeWidth.value}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(response);
      setIsOptions(true);
      const options = [
        ...response.data.data.nonStandardLengths.map((length, index) => ({
          value: `${length}-${index}`,
          label: `${length}yd`,
        })),
        ...Array.from(
          { length: response.data.data.standardCount },
          (_, index) => ({
            value: `120-${index}`, // 고유 value 추가
            label: '120yd', // UI에 표시되는 label은 동일
          })
        ),
      ];
      setHorizontalLengthOptions(options);
    } catch (error) {
      // console.log(error);
    }
  };

  // 사용할 길이(m)
  const handleRequestedLengthInputChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,3}$/.test(value)) {
      setRequestedLength(value);
    }
  };

  // 최대로 사용할 수 있는 길이
  useEffect(() => {
    if (horizontalLength !== null) {
      const calculatedMax = parseFloat(
        (serverHorizontalLength / 1.094).toFixed(3)
      );
      setMaxRequestedLength(calculatedMax);
    }
  }, [horizontalLength, requestedLength]);

  const formatDate = (date) => {
    // 로컬 타임존으로 날짜를 조정한 후 "YYYY-MM-DD" 형식으로 반환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 요청 날짜
  const handleRequestedDateInputChange = (date) => {
    const formattedDate = formatDate(date);
    setRequestedDate(formattedDate);
  };

  // 사용 현수막(yd)
  const handleHorizontalLengthInputChange = (e) => {
    setHorizontalLength(e);
    handleServerHorizontalLengthInputChange(e);
  };

  // 서버로 보낼 현수막 데이터
  const handleServerHorizontalLengthInputChange = (e) => {
    const value = e.label;
    const numericValue = Number(value.replace('yd', ''));
    setServerHorizontalLength(numericValue);
  };

  // 게시 날짜
  const handlePostedDateInputChange = (date) => {
    const formattedDate = formatDate(date);
    setPostedDate(formattedDate);
  };

  // 게시 기간(일)
  const handlePostedDurationInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPostedDuration(value);
    }
  };

  // 게시 장소
  const handlePostedLocationInputChange = (e) => {
    setPostedLocation(e.target.value);
  };

  // 고객명
  const handleClientNameInputChange = (e) => {
    setClientName(e.target.value);
  };

  // qr 발생 버튼 클릭 시
  const handleSubmit = async () => {
    if (!requestedDate) {
      openModal({
        primaryText: '요청 날짜를 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (!horizontalLength) {
      openModal({
        primaryText: '사용 현수막의 폭을 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (!requestedLength) {
      openModal({
        primaryText: '사용할 길이를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (maxRequestedLength < requestedLength) {
      openModal({
        primaryText: `${maxRequestedLength}m 이하의 길이를 입력해주세요.`,
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (!postedDate) {
      openModal({
        primaryText: '게시 날짜를 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (!postedDuration) {
      openModal({
        primaryText: '게시 기간을 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (!postedLocation) {
      openModal({
        primaryText: '게시 장소를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    } else if (!clientName) {
      openModal({
        primaryText: '고객명을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
        },
      });
      return;
    }

    const data = {
      clientName: clientName,
      postedLocation: postedLocation,
      requestedDate: requestedDate,
      postedDate: postedDate,
      postedDuration: Number(postedDuration),
      typeWidth: typeWidth.value,
      horizontalLength: serverHorizontalLength,
      requestedLength: Number(requestedLength),
    };

    try {
      const response = await apiClient.post(`${apiUrl}/api/v1/qr-code`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      });

      // console.log(response);

      // Blob 객체 생성
      const blob = new Blob([response.data], { type: 'image/png' });

      // Blob을 URL로 변환
      const url = URL.createObjectURL(blob);

      setImageUrl(url); // 상태로 URL 저장
    } catch (error) {
      // console.log(error);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '9999px', // 완전 동그란 모서리
      padding: '5px', // 선택 사항: 더 둥글게 보이도록 추가 여백
      borderColor: '#ccc', // 선택 사항: 테두리 색상
      boxShadow: 'none', // 선택 사항: 기본 그림자 제거
    }),
    // menu: (provided) => ({
    //   ...provided,
    //   borderRadius: '10px', // 드롭다운 메뉴의 모서리도 둥글게
    // }),
  };

  useEffect(() => {
    if (imageUrl && qrSectionRef.current) {
      qrSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [imageUrl]);

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
          <div
            className={`flex flex-col w-full px-4 py-4 ${isOptions ? 'h-auto' : 'h-2/5 slide-down'} justify-${isOptions ? 'start' : 'center'}  ${isOptions && 'slide-up'}`}
          >
            {/* 폭 선택하기 */}
            <div className="flex flex-col w-full">
              {/* <span className="text-3xl font-bold mb-6">폭 선택하기(mm)</span> */}
              {isOptions ? (
                <span className="text-xl font-bold">폭 선택(mm)</span>
              ) : (
                <span className="text-xl font-bold mb-2">
                  QR 코드를 생성하려면, 먼저 현수막의 폭을 선택해주세요.
                </span>
              )}
              <div className="flex flex-col justify-center items-center">
                <div className="flex w-full mt-4 justify-center items-center space-x-4">
                  <Select
                    options={typeWidthOptions}
                    value={typeWidth}
                    onChange={(selectedOption) => setTypeWidth(selectedOption)}
                    placeholder="폭을 선택해주세요"
                    // isClearable
                    className="w-2/3"
                    styles={customStyles}
                  />
                  <button
                    type="submit"
                    onClick={handleSearchTypeWidth}
                    className="flex justify-center items-center px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                  >
                    <FaSearch className="text-md text-white mr-1" />
                    검색
                  </button>
                </div>
              </div>
            </div>
            {/* 사용 가능한 현수막에 대한 추가 설정 */}
            {isOptions && (
              <div className="flex flex-col w-full">
                {/* 요청 정보 */}
                <div className="flex flex-col justify-center mt-12 text-left">
                  <div className="flex w-full items-center mb-4">
                    <span className="text-xl font-bold text-gray4">
                      요청 정보
                    </span>
                  </div>
                  <hr className="w-full border-t border-gray1 mb-6" />
                  <div className="flex w-full justify-between items-center space-x-4">
                    <div className="flex flex-col w-1/3">
                      <span className="text-lg font-bold mb-2">요청 날짜</span>
                      <DatePicker
                        selected={requestedDate}
                        onChange={handleRequestedDateInputChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="요청 날짜를 선택해주세요"
                        className="w-full px-4 py-2 text-sm border border-gray2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        popperClassName="border border-gray3 shadow-lg bg-white"
                      />
                    </div>
                    <div className="flex flex-col w-1/3 text-left">
                      <span className="text-lg font-bold mt-2">
                        사용 현수막(yd)
                      </span>
                      <div className="flex items-center py-2 space-x-2">
                        <Select
                          options={horizontalLengthOptions}
                          value={horizontalLength}
                          onChange={handleHorizontalLengthInputChange}
                          placeholder="폭을 선택해주세요"
                          className="w-full text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-1/3 relative">
                      <div className="flex items-end space-x-2">
                        <span className="text-lg font-bold mt-2">
                          사용할 길이(m)
                        </span>
                        <AiFillExclamationCircle
                          onMouseEnter={() => handleMouseEnter(true)}
                          onMouseLeave={handleMouseLeave}
                          className="text-2xl text-primary hover:text-hover"
                        />
                        {isMenuOpen && (
                          <div className="flex flex-col absolute top-[45%] left-0 w-auto px-5 py-3 z-20 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                            <span className="text-gray4 text-sm whitespace-nowrap">
                              소수점 셋째 자리까지 입력할 수 있습니다.
                            </span>
                            <span className="text-gray4 text-sm">
                              숫자만 입력해주세요.
                            </span>
                            <span className="text-gray3 text-xs">
                              ex) 1 | 3.14 | 2.222
                            </span>
                          </div>
                        )}
                      </div>
                      {/* <span className="text-xs text-gray3">
                        소수점 셋째 자리까지 입력할 수 있습니다. 숫자만
                        입력해주세요.
                      </span> */}
                      <div className="flex flex-col py-2 space-x-2">
                        <input
                          className="w-full p-2 border border-gray2 rounded-md text-sm"
                          value={requestedLength}
                          onChange={handleRequestedLengthInputChange}
                          type="text"
                          placeholder="사용할 길이를 입력해주세요"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center space-x-4">
                    <div className="w-1/3"></div>
                    <div className="w-1/3"></div>
                    <div className="w-1/3">
                      {horizontalLength !== null && (
                        <span className="text-left text-sm text-warning">
                          <span className="font-bold">
                            {maxRequestedLength}m{` `}
                          </span>
                          이하의 값을 입력해주세요.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* <hr className="w-full border-t border-gray1 my-6" /> */}
                {/* 게시 정보 */}
                <div className="flex flex-col justify-center mt-16 text-left">
                  <div className="flex w-full items-center mb-4">
                    <span className="text-xl font-bold">게시 정보</span>
                  </div>
                  <hr className="w-full border-t border-gray1 mb-6" />
                  <div className="flex w-full justify-between items-center space-x-4">
                    <div className="flex flex-col w-1/3">
                      <span className="text-lg font-bold mb-2">게시 날짜</span>
                      <DatePicker
                        selected={postedDate}
                        onChange={handlePostedDateInputChange}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="게시 날짜를 선택해주세요"
                        className="w-full px-4 py-2 text-sm border border-gray2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        popperClassName="border border-gray3 shadow-lg bg-white"
                      />
                    </div>
                    <div className="flex flex-col w-1/3 text-left">
                      <span className="text-lg font-bold mt-2">
                        게시 기간(일)
                      </span>
                      <div className="flex items-center py-2 space-x-2">
                        <input
                          className="w-full p-2 border border-gray2 rounded-md text-sm"
                          value={postedDuration}
                          onChange={handlePostedDurationInputChange}
                          type="number"
                          placeholder="게시 기간을 입력해주세요"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-1/3">
                      <span className="text-lg font-bold mt-2">게시 장소</span>
                      <div className="flex items-center py-2 space-x-2">
                        <input
                          className="w-full p-2 border border-gray2 rounded-md text-sm"
                          value={postedLocation}
                          onChange={handlePostedLocationInputChange}
                          type="text"
                          placeholder="게시 장소를 입력해주세요"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <hr className="w-full border-t border-gray1 my-6" /> */}
                {/* 고객 정보 */}
                <div className="flex flex-col justify-center mt-16 text-left">
                  <div className="flex w-full items-center mb-4">
                    <span className="text-xl font-bold">고객 정보</span>
                  </div>
                  <hr className="w-full border-t border-gray1 mb-6" />
                  <div className="flex w-full justify-between items-center space-x-4">
                    <div className="flex flex-col w-1/3">
                      <span className="text-lg font-bold">고객명</span>
                      <div className="flex items-center py-2 space-x-2">
                        <input
                          className="w-full text-sm p-2 border border-gray2 rounded-md"
                          value={clientName}
                          onChange={handleClientNameInputChange}
                          type="text"
                          placeholder="고객명을 입력해주세요"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div ref={qrSectionRef} className="flex justify-end mt-4 mb-12">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                  >
                    QR 발생하기
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* QR 발생 칸 */}
          {/* <div className="flex justify-center min-h-48 mt-12 border border-gray3"> */}
          {imageUrl && (
            <div
              // ref={qrSectionRef}
              className="flex flex-col justify-center min-h-48 mb-24"
            >
              <span className="text-3xl font-bold mb-6">
                <span className="text-primary">QR코드</span>가 생성되었습니다.
              </span>
              {/* <span></span> */}
              <div className="flex w-auto justify-center items-center space-x-12">
                <img
                  className="border-4 border-primary"
                  src={imageUrl}
                  alt="QR Code"
                />
                <div className="flex flex-col">
                  <table className="table-auto border-collapse w-full text-left">
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 font-bold">요청 날짜</td>
                        <td className="px-4 py-2">{requestedDate}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">폭</td>
                        <td className="px-4 py-2">
                          {typeWidth?.value}
                          <span className="text-sm">mm</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">사용 현수막</td>
                        <td className="px-4 py-2">
                          {serverHorizontalLength}
                          <span className="text-sm">yd</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">사용할 길이</td>
                        <td className="px-4 py-2">
                          {requestedLength}
                          <span className="text-sm">m</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">게시 날짜</td>
                        <td className="px-4 py-2">{postedDate}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">게시 기간</td>
                        <td className="px-4 py-2">{postedDuration}일</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">게시 장소</td>
                        <td className="px-4 py-2">{postedLocation}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-bold">고객명</td>
                        <td className="px-4 py-2">{clientName}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* </div> */}
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default Qr;

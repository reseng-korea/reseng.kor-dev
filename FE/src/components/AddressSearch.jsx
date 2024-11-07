import React, { useState, useEffect } from 'react';

import { FaMagnifyingGlass } from 'react-icons/fa6';

const AddressSearch = () => {
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // 스크립트 로드 상태 관리

  // Daum 주소 검색 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;

    script.onload = () => {
      setIsScriptLoaded(true); // 스크립트 로드 완료 시 상태 업데이트
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // Daum 주소 검색 함수
  const handleAddressSearch = () => {
    if (!isScriptLoaded) {
      alert('주소 검색 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        let addr = ''; // 주소 변수
        let extraAddr = ''; // 참고항목 변수

        // 사용자가 선택한 주소 타입에 따라 주소 값 결정
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress; // 도로명 주소
        } else {
          addr = data.jibunAddress; // 지번 주소
        }

        // 도로명 주소일 때 참고 항목 추가
        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr +=
              extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          if (extraAddr !== '') {
            extraAddr = ` (${extraAddr})`;
          }
        }

        // 상태 업데이트
        setPostcode(data.zonecode);
        setAddress(addr);
        setExtraAddress(extraAddr);

        // 상세주소 입력 필드로 포커스 이동
        document.getElementById('sample6_detailAddress').focus();
      },
    }).open();
  };

  return (
    <div className="flex flex-col items-center px-3 py-2">
      {/* 도로명주소 입력 필드 */}
      <div className="w-full flex items-center justify-center mb-1 space-x-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="주소"
          id="sample6_address"
          className={`flex-grow border rounded-lg p-2 mb-1`}
          readOnly
        />

        {/* 주소 검색 버튼 */}
        <button
          onClick={handleAddressSearch}
          className="group flex-grow-0 mb-2 bg-primary font-bold py-2 px-4 rounded-lg hover:bg-hover transition-colors duration-300"
        >
          <div className="w-full flex items-center justify-center space-x-2">
            <FaMagnifyingGlass className="text-white transition-colors duration-300" />
            <span className="text-white transition-colors duration-300">
              주소 검색
            </span>
          </div>
        </button>
      </div>

      {/* 상세주소 입력 필드 */}
      <input
        type="text"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
        placeholder="상세주소"
        id="sample6_detailAddress"
        className={`w-full border rounded-lg p-2 mb-1`}
      />
    </div>
  );
};

export default AddressSearch;

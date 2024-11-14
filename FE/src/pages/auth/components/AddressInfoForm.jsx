import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddressSearch from '../../../components/AddressSearch';

const AddressInfoForm = ({
  region,
  setRegion,
  subRegion,
  setSubRegion,
  address,
  setAddress,
  detailAddress,
  setDetailAddress,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [regionsData, setRegionsData] = useState({});
  const [subRegionsData, setSubRegionsData] = useState({});

  // 페이지 로드 시 `regionsData`를 자동으로 가져옴
  useEffect(() => {
    async function loadRegionsData() {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/regions/cities`);
        const regions = response.data.data.reduce((acc, item) => {
          acc[item.regionName] = { id: item.id };
          return acc;
        }, {});
        setRegionsData(regions);
      } catch (error) {
        console.log(error);
      }
    }

    loadRegionsData();
  }, [apiUrl]);

  // `region`이 변경될 때마다 `subRegion` 목록을 자동으로 불러옴
  useEffect(() => {
    async function loadSubRegions() {
      if (region && regionsData[region]) {
        try {
          const response = await axios.get(
            `${apiUrl}/api/v1/regions/${regionsData[region].id}/districts`
          );
          const subRegions = response.data.data.reduce((acc, item) => {
            acc[item.regionName] = item.regionName;
            return acc;
          }, {});
          setSubRegionsData(subRegions);
        } catch (error) {
          console.log(error);
        }
      } else {
        setSubRegionsData({}); // region이 없으면 하위 지역 초기화
      }
    }

    loadSubRegions();
  }, [region, regionsData, apiUrl]);

  const handleRegionInputChange = (e) => {
    const newRegion = e.target.value;
    setRegion(newRegion);
    setSubRegion(''); // 하위 지역 초기화
  };

  return (
    <>
      {/* 광역자치구 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">광역자치구</label>
        <select
          className="w-full p-2 mb-1 border rounded-lg"
          value={region || ''}
          onChange={handleRegionInputChange}
        >
          <option value="">광역자치구를 선택해주세요</option>
          {Object.keys(regionsData).map((regionName) => (
            <option key={regionName} value={regionName}>
              {regionName}
            </option>
          ))}
        </select>
      </div>

      {/* 지역자치구 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">지역자치구</label>
        <select
          className="w-full p-2 mb-1 border rounded-lg"
          value={subRegion || ''}
          onChange={(e) => setSubRegion(e.target.value)}
          disabled={!region}
        >
          <option value="">지역자치구를 선택해주세요</option>
          {Object.keys(subRegionsData).map((subRegionName) => (
            <option key={subRegionName} value={subRegionName}>
              {subRegionName}
            </option>
          ))}
        </select>
      </div>

      {/* 주소 */}
      <div>
        <AddressSearch
          address={address}
          setAddress={setAddress}
          detailAddress={detailAddress}
          setDetailAddress={setDetailAddress}
        />
      </div>
    </>
  );
};

export default AddressInfoForm;

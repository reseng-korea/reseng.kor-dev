import React, { useState } from 'react';
import axios from 'axios';

import { regionsData } from '../../../data/regionsData';
import AddressSearch from '../../../components/AddressSearch';

const AddressInfoForm = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [selectedMetropolitan, setSelectedMetropolitan] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleMetropolitanChange = (e) => {
    setSelectedMetropolitan(e.target.value);
    setSelectedDistrict('');
  };

  const handleMetropolitanClick = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/regions/cities`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* 광역자치구 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">광역자치구</label>
        <select
          className="w-full p-2 mb-1 border rounded-lg"
          value={selectedMetropolitan}
          onChange={handleMetropolitanChange}
          onClick={handleMetropolitanClick}
        >
          <option value="">광역자치구를 선택해주세요</option>
          {Object.keys(regionsData).map((metropolitan) => (
            <option key={metropolitan} value={metropolitan}>
              {metropolitan}
            </option>
          ))}
        </select>
      </div>

      {/* 지역자치구 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">지역자치구</label>
        <select
          className="w-full p-2 mb-1 border rounded-lg"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedMetropolitan}
        >
          <option value="">지역자치구를 선택해주세요</option>
          {selectedMetropolitan &&
            regionsData[selectedMetropolitan].map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
        </select>
      </div>

      {/* 주소 */}
      <div>
        <AddressSearch />
      </div>
    </>
  );
};

export default AddressInfoForm;

import React, { useState } from 'react';

const CompanyNameInfoForm = ({ companyName, setCompanyName }) => {
  const handleCompanyNameInputChange = (e) => {
    const newCompanyName = e.target.value;
    setCompanyName(newCompanyName);
  };

  return (
    <>
      {/* 업체명 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">업체명</label>
        <input
          type="text"
          value={companyName}
          onChange={handleCompanyNameInputChange}
          className="w-full p-2 mb-1 border rounded-lg"
          placeholder="업체명을 입력해주세요"
        />
      </div>
    </>
  );
};

export default CompanyNameInfoForm;

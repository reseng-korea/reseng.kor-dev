import React, { useState } from 'react';

const CompanyNameInfoForm = () => {
  const [companyName, setCompanyName] = useState('');
  return (
    <>
      {/* 업체명 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">업체명</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full p-2 mb-1 border rounded-lg"
          placeholder="업체명을 입력해주세요"
        />
      </div>
    </>
  );
};

export default CompanyNameInfoForm;

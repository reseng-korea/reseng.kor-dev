import React, { useState } from 'react';

const CompanyContactInfoForm = () => {
  const [companyNumber, setCompanyNumber] = useState('');
  const [companyFax, setcompanyFax] = useState('');

  return (
    <>
      {/* 회사 번호 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">회사 번호</label>
        <div className="flex items-center justify-center w-full mb-1 space-x-2">
          <input
            type="tel"
            maxLength="11"
            value={companyNumber}
            onChange={(e) => setCompanyNumber(e.target.value)}
            className="flex-grow p-2 mb-1 border rounded-lg"
            placeholder="숫자만 입력해주세요"
          />
        </div>
      </div>

      {/* 팩스 번호 */}
      <div className="flex flex-col items-center px-3 py-2">
        <label className="self-start mb-2 text-lg">팩스 번호</label>
        <div className="flex items-center justify-center w-full mb-1 space-x-2">
          <input
            type="tel"
            maxLength="11"
            value={companyFax}
            onChange={(e) => setcompanyFax(e.target.value)}
            className="flex-grow p-2 mb-1 border rounded-lg"
            placeholder="숫자만 입력해주세요"
          />
        </div>
      </div>
    </>
  );
};

export default CompanyContactInfoForm;

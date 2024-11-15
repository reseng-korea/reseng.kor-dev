import React, { useState } from 'react';

const OwnerNameInfoForm = ({ ownerName, setOwnerName }) => {
  const handleCompanyNameInputChange = (e) => {
    const newCompanyName = e.target.value;
    setOwnerName(newCompanyName);
  };
  return (
    <div className="flex flex-col items-center px-3 py-2">
      <label className="self-start mb-2 text-lg">대표자명</label>
      <input
        type="text"
        value={ownerName}
        onChange={handleCompanyNameInputChange}
        className="w-full p-2 mb-1 border rounded-lg"
        placeholder="이름을 입력해주세요"
      />
    </div>
  );
};

export default OwnerNameInfoForm;

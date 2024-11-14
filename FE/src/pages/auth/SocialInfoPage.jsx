import React, { useState } from 'react';
import Layout from '../../components/Layouts';

import EmailInfoForm from './components/EmailInfoForm';
import PhoneNumberInfoForm from './components/PhoneNumberInfoForm';
import CompanyNameInfoForm from './components/CompanyNameInfoForm';
import OwnerNameInfoForm from './components/OwnerNameInfoForm';
import AddressInfoForm from './components/AddressInfoForm';

const AddSignupPage = () => {
  return (
    <Layout>
      <div className="flex flex-col mb-24 items-center justify-start">
        <div className="w-full max-w-2xl p-8">
          <h1 className="mt-28 mb-12 text-3xl font-bold">
            회원 정보 추가 입력
          </h1>
          <span className="text-xs text-gray4 sm:text-sm">
            원활한 사용을 위해 추가 정보가 필요합니다. 필수 항목을 입력해
            주세요. 감사합니다 :)
          </span>
          <hr className="w-full mt-2 mb-6 border-t-2 border-primary" />

          <EmailInfoForm />
          <PhoneNumberInfoForm />
          <CompanyNameInfoForm />
          <OwnerNameInfoForm />
          <AddressInfoForm />

          {/* 회원가입 버튼 */}
          <div className="flex flex-col items-center px-3 py-2">
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddSignupPage;

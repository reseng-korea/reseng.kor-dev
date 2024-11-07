import React, { useState } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';

import EmailInfoForm from './components/EmailInfoForm';
import PasswordInfoForm from './components/PasswordInfoForm';
import PhoneNumberInfoForm from './components/PhoneNumberInfoForm';
import CompanyNameInfoForm from './components/CompanyNameInfoForm';
import OwnerNameInfoForm from './components/OwnerNameInfoForm';
import CompanyContactInfoForm from './components/CompanyContactInfoForm';
import AddressInfoForm from './components/AddressInfoForm';

const SignupPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl p-8">
          <h1 className="mt-28 mb-12 text-3xl font-bold">회원가입</h1>

          <hr className="w-full mb-6 border-t-2 border-primary" />

          <EmailInfoForm />
          <PasswordInfoForm />
          <PhoneNumberInfoForm />
          <CompanyNameInfoForm />
          <OwnerNameInfoForm />
          <CompanyContactInfoForm />
          <AddressInfoForm />

          {/* 회원가입 버튼 */}
          <div className="flex flex-col items-center px-3 py-2">
            <button
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-hover"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;

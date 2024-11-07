import React, { useState } from 'react';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import EmailInfoForm from '../auth/components/EmailInfoForm';
import PasswordInfoForm from '../auth/components/PasswordInfoForm';
import PhoneNumberInfoForm from '../auth/components/PhoneNumberInfoForm';
import OwnerNameInfoForm from '../auth/components/OwnerNameInfoForm';
import CompanyNameInfoForm from '../auth/components/CompanyNameInfoForm';
import CompanyContactInfoForm from '../auth/components/CompanyContactInfoForm';
import AddressInfoForm from '../auth/components/AddressInfoForm';

const UserEdit = () => {
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start min-h-screen px-3 py-2">
        <div className="flex flex-col items-center justify-center w-full">
          <SubNavbar
            items={navItems}
            activePage="회원 정보 수정"
            mainCategory="마이페이지"
          />
          {/* 메인 */}
          <div className="flex flex-col w-full max-w-2xl px-8 pt-4 pb-8 mx-auto">
            <span className="mb-4 text-left">
              안전한 서비스 이용을 위해 회원 정보를 최신 상태로 유지해 주세요.
            </span>
            <hr className="w-full mb-6 border-t border-gray-300" />

            <EmailInfoForm />
            <PasswordInfoForm />
            <PhoneNumberInfoForm />
            <OwnerNameInfoForm />
            <CompanyNameInfoForm />
            <CompanyContactInfoForm />
            <AddressInfoForm />

            <span className="mx-4 text-sm text-right text-gray2 cursor-pointer">
              탈퇴하기
            </span>

            {/* 회원 정보 수정 및 취소 버튼 */}
            <div className="flex items-center justify-center w-full px-3 py-2 mb-4 space-x-4">
              <button
                type="submit"
                className="w-1/3 px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-white hover:text-primary"
              >
                회원 정보 수정
              </button>
              <button
                type="submit"
                className="w-1/3 px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg hover:bg-primary hover:text-white"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserEdit;

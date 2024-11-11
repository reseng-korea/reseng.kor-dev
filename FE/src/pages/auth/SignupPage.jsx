import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import useModal from '../../hooks/useModal';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import usePreventRefresh from '../../hooks/usePreventRefresh';

import EmailInfoForm from './components/EmailInfoForm';
import PasswordInfoForm from './components/PasswordInfoForm';
import PhoneNumberInfoForm from './components/PhoneNumberInfoForm';
import CompanyNameInfoForm from './components/CompanyNameInfoForm';
import OwnerNameInfoForm from './components/OwnerNameInfoForm';
import CompanyContactInfoForm from './components/CompanyContactInfoForm';
import AddressInfoForm from './components/AddressInfoForm';

const SignupPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();

  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isConfirmEmail, setIsConfirmEmail] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const [companyFaxNumber, setCompanyFaxNumber] = useState('');
  const [region, setRegion] = useState('');
  const [subRegion, setSubRegion] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  // console.log(email, isValidEmail);
  // console.log(password, isValidPassword);
  // console.log(phoneNumber, isValidPhoneNumber);
  // console.log(companyName);
  // console.log(ownerName);
  // console.log(companyPhoneNumber);
  // console.log(companyFaxNumber);
  // console.log(region);
  // console.log(subRegion);
  // console.log(address);
  // console.log(detailAddress);

  const handleSubmit = async () => {
    if (!email) {
      setModalOpen(true);
      openModal({
        primaryText: '이메일을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isValidEmail) {
      setModalOpen(true);
      openModal({
        primaryText: '올바른 이메일을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isConfirmEmail) {
      setModalOpen(true);
      openModal({
        primaryText: '이메일 중복 확인을 해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!password) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!confirmPassword) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isValidPassword) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호가 일치하지 않습니다.',
        context: ' 확인 후 다시 입력해 주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!phoneNumber) {
      setModalOpen(true);
      openModal({
        primaryText: '휴대폰 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (phoneNumber.length != 11) {
      setModalOpen(true);
      openModal({
        primaryText: '올바른 휴대폰 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!isValidPhoneNumber) {
      setModalOpen(true);
      openModal({
        primaryText: '휴대폰 번호 인증을 해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!companyName) {
      setModalOpen(true);
      openModal({
        primaryText: '업체명을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!ownerName) {
      setModalOpen(true);
      openModal({
        primaryText: '대표자명을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!companyPhoneNumber) {
      setModalOpen(true);
      openModal({
        primaryText: '회사 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!companyFaxNumber) {
      setModalOpen(true);
      openModal({
        primaryText: '팩스 번호를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!region) {
      setModalOpen(true);
      openModal({
        primaryText: '광역자치구를 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!subRegion) {
      setModalOpen(true);
      openModal({
        primaryText: '지역자치구를 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!address) {
      setModalOpen(true);
      openModal({
        primaryText: '주소를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!detailAddress) {
      setModalOpen(true);
      openModal({
        primaryText: '상세 주소를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/register`,
          {
            email: email,
            password: password,
            companyName: companyName,
            representativeName: ownerName,
            phoneNumber: phoneNumber,
            companyPhoneNumber: companyPhoneNumber,
            faxNumber: companyFaxNumber,
            cityName: region,
            districtName: subRegion,
            streetAddress: address,
            detailAddress: detailAddress,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(response);

        if (
          response.data.message == '요청에 성공되어 데이터가 생성되었습니다'
        ) {
          setModalOpen(true);
          openModal({
            primaryText: '회원가입이 완료되었습니다.',
            type: 'success',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
              navigateTo(routes.signin);
            },
          });
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl p-8">
          <h1 className="mt-28 mb-12 text-3xl font-bold">회원가입</h1>

          <hr className="w-full mb-6 border-t-2 border-primary" />

          <EmailInfoForm
            email={email}
            setEmail={setEmail}
            isValidEmail={isValidEmail}
            setIsValidEmail={setIsValidEmail}
            isConfirmEmail={isConfirmEmail}
            setIsConfirmEmail={setIsConfirmEmail}
            isAuthVerified={isAuthVerified}
            setIsAuthVerified={setIsAuthVerified}
            isClicked={isClicked}
            setIsClicked={setIsClicked}
          />
          <PasswordInfoForm
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isValidPassword={isValidPassword}
            setIsValidPassword={setIsValidPassword}
          />
          <PhoneNumberInfoForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isValidPhoneNumber={isValidPhoneNumber}
            setIsValidPhoneNumber={setIsValidPhoneNumber}
          />
          <CompanyNameInfoForm
            companyName={companyName}
            setCompanyName={setCompanyName}
          />
          <OwnerNameInfoForm
            ownerName={ownerName}
            setOwnerName={setOwnerName}
          />
          <CompanyContactInfoForm
            companyPhoneNumber={companyPhoneNumber}
            setCompanyPhoneNumber={setCompanyPhoneNumber}
            companyFaxNumber={companyFaxNumber}
            setCompanyFaxNumber={setCompanyFaxNumber}
          />
          <AddressInfoForm
            region={region}
            setRegion={setRegion}
            subRegion={subRegion}
            setSubRegion={setSubRegion}
            address={address}
            setAddress={setAddress}
            detailAddress={detailAddress}
            setDetailAddress={setDetailAddress}
          />

          {/* 회원가입 버튼 */}
          <div className="flex flex-col items-center px-3 py-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full px-4 py-3 font-bold text-white bg-primary rounded-lg hover:bg-hover"
            >
              가입하기
            </button>
          </div>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </Layout>
  );
};

export default SignupPage;

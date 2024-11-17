import React, { useState } from 'react';
import Layout from '../../components/Layouts';

import EmailInfoForm from './components/EmailInfoForm';
import PhoneNumberInfoForm from './components/PhoneNumberInfoForm';
import CompanyNameInfoForm from './components/CompanyNameInfoForm';
import OwnerNameInfoForm from './components/OwnerNameInfoForm';
import CompanyContactInfoForm from './components/CompanyContactInfoForm';
import AddressInfoForm from './components/AddressInfoForm';

const AddSignupPage = () => {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isConfirmEmail, setIsConfirmEmail] = useState(false);
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const [companyFaxNumber, setCompanyFaxNumber] = useState('');
  const [region, setRegion] = useState('');
  const [subRegion, setSubRegion] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

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
          <PhoneNumberInfoForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isValidPhoneNumber={isValidPhoneNumber}
            setIsValidPhoneNumber={setIsValidPhoneNumber}
            isPhoneNumberVerified={isPhoneNumberVerified}
            setIsPhoneNumberVerified={setIsPhoneNumberVerified}
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

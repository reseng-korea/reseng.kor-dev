import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import useModal from '../../hooks/useModal';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import usePreventRefresh from '../../hooks/usePreventRefresh';

import EmailInfoForm from '../auth/components/EmailInfoForm';
import PasswordInfoForm from '../auth/components/PasswordInfoForm';
import PhoneNumberInfoForm from '../auth/components/PhoneNumberInfoForm';
import OwnerNameInfoForm from '../auth/components/OwnerNameInfoForm';
import CompanyNameInfoForm from '../auth/components/CompanyNameInfoForm';
import CompanyContactInfoForm from '../auth/components/CompanyContactInfoForm';
import AddressInfoForm from '../auth/components/AddressInfoForm';

const UserEdit = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '업체 관리', route: '/mypage/member' },
    { label: '현수막 관리', route: '/mypage/manage' },
    { label: '현수막 발주', route: '/mypage/order' },
    { label: 'QR 발생기', route: '/mypage/qr' },
    { label: '회원 정보 수정', route: '/mypage/user' },
  ];
  const { navigateTo, routes } = useNavigateTo();

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const accesstoken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const refreshtoken = localStorage.getItem('refreshToken');

  console.log(userId);

  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isConfirmEmail, setIsConfirmEmail] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(true);
  const [isClicked, setIsClicked] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [isPhoneNumberVerified, setIsPhoneNumberVerified] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [companyPhoneNumber, setCompanyPhoneNumber] = useState('');
  const [companyFaxNumber, setCompanyFaxNumber] = useState('');
  const [region, setRegion] = useState('');
  const [subRegion, setSubRegion] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/users/${userId}`, {
          headers: {
            Authorization: accesstoken,
            'Content-Type': 'application/json',
          },
        });

        setEmail(response.data.data.email);
        setPhoneNumber(response.data.data.phoneNumber);
        setOwnerName(response.data.data.representativeName);
        setCompanyName(response.data.data.companyName);
        setCompanyPhoneNumber(
          response.data.data.userProfile.companyPhoneNumber
        );
        setCompanyFaxNumber(response.data.data.userProfile.faxNumber);
        setRegion(response.data.data.userProfile.city.regionName);
        setSubRegion(response.data.data.userProfile.district.regionName);
        setAddress(response.data.data.userProfile.streetAddress);
        setDetailAddress(response.data.data.userProfile.detailAddress);

        console.log(response);
        console.log(response.data.data.email); //이메일
        console.log(response.data.data.phoneNumber); //휴대폰 번호
        // 대표자명
        console.log(response.data.data.companyName); //업체명
        console.log(response.data.data.userProfile.companyPhoneNumber); //회사번호
        console.log(response.data.data.userProfile.faxNumber); //팩스번호
        console.log(response.data.data.userProfile.city);
        console.log(response.data.data.userProfile.district);
        console.log(response.data.data.userProfile.streetAddress); //주소
        console.log(response.data.data.userProfile.detailAddress); //상세주소
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // 비동기 함수 호출
  }, []);

  // 회원 정보 수정 버튼 클릭
  const handleSubmit = async () => {
    if (!password) {
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
        const response = await axios.put(
          `${apiUrl}/api/v1/users/${userId}`,
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
              Authorization: accesstoken,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(response);
        console.log(response.status);

        if (response.status == 200) {
          setModalOpen(true);
          openModal({
            primaryText: '변경 사항이 저장되었습니다.',
            type: 'success',
            isAutoClose: false,
            onConfirm: () => {
              closeModal(), setModalOpen(false);
              navigateTo(routes.home);
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // 취소 버튼 클릭
  const handleCancle = () => {
    setModalOpen(true);
    openModal({
      primaryText: '변경 사항이 저장되지 않습니다.',
      secondaryText: '취소하시겠습니까?',
      type: 'warning',
      isAutoClose: false,
      cancleButton: true,
      onConfirm: () => {
        closeModal();
        setModalOpen(false);
        navigateTo(routes.home);
      },
    });
  };

  // 탈퇴하기 버튼 클릭
  const handleWithdraw = async () => {
    setModalOpen(true);
    openModal({
      primaryText: '정말 탈퇴하시겠습니까?',
      secondaryText: '탈퇴 시, 계정은 비활성화됩니다.',
      context: '같은 정보로 재가입 시 관리자에게 문의하세요.',
      type: 'warning',
      isAutoClose: false,
      cancleButton: true,
      buttonName: '취소',
      cancleButtonName: '탈퇴',
      onConfirm: () => {
        closeModal();
        setModalOpen(false);
      },
      onCancel: async () => {
        try {
          const response = await axios.put(
            `${apiUrl}/api/v1/users/withdrawal`,
            {},
            {
              headers: {
                Refresh: refreshtoken,
              },
            }
          );

          if (response.data.code == 200) {
            navigateTo(routes.mypageWithdraw);
          }
          console.log(response);
        } catch (error) {
          console.log(error);
          setModalOpen(true);
          openModal({
            primaryText: '탈퇴 요청이 실패했습니다.',
            secondaryText: '잠시 후 다시 시도해 주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal();
              setModalOpen(false);
            },
          });
        }
      },
    });
  };

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

            <span
              onClick={handleWithdraw}
              className="mx-4 text-sm text-right text-gray2 cursor-pointer hover:text-gray3"
            >
              탈퇴하기
            </span>

            {/* 회원 정보 수정 및 취소 버튼 */}
            <div className="flex items-center justify-center w-full px-3 py-2 mb-4 space-x-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-1/3 px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
              >
                회원 정보 수정
              </button>
              <button
                type="submit"
                onClick={handleCancle}
                className="w-1/3 px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg hover:bg-hoverLight hover:border-hoverLight"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </Layout>
  );
};

export default UserEdit;

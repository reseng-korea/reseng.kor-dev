import { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { ModalProvider } from './context/ModalContext';

import { useModalContext } from './context/ModalContext';

import useModal from './hooks/useModal';

import { setOpenModal } from './services/auth/authService';

import './App.css';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import OAuthRedirectHandler from './components/OAuthRedirectHandler';

// main
import MainFirstPage from './pages/main/MainFirstPage';
import MainSecondPage from './pages/main/MainSecondPage';
import MainThirdPage from './pages/main/MainThirdPage';
import MainFourthPage from './pages/main/MainFourthPage';
import MainFifthPage from './pages/main/MainFifthPage';
import MainSixthPage from './pages/main/MainSixthPage';
import MainSeventhPage from './pages/main/MainSeventhPage';
import SliderMainFourthPage from './pages/main/SliderMainFourthPage';

// auth
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SocialInfoPage from './pages/auth/SocialInfoPage';
import FindIdPage from './pages/auth/FindIdPage';
import FindIdSuccessPage from './pages/auth/FindIdSuccessPage';
import FindIdFailurePage from './pages/auth/FindIdFailurePage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import TermsAndPolicyNonSocial from './pages/auth/TermsAndPolicyNonSocial';
import TermsAndPolicySocial from './pages/auth/TermsAndPolicySocial';
import PrivacyPolicy from './pages/auth/PrivacyPolicy';
import TermsOfUse from './pages/auth/TermsOfUse';

//company
import Company from './pages/company/Company';
import History from './pages/company/History';
import Location from './pages/company/Location';

//cs
import Faq from './pages/cs/Faq';
import Qna from './pages/cs/Qna';
import QnaRegister from './pages/cs/QnaRegister';
import QnaDetail from './pages/cs/QnaDetail';

//reference Room
import DocumentRegister from './pages/referenceRoom/DocumentRegister';
import Certificate from './pages/referenceRoom/Certificate';
import Coa from './pages/referenceRoom/Coa';
import Press from './pages/referenceRoom/Press';
import Extra from './pages/referenceRoom/Extra';
import DocumentDetail from './pages/referenceRoom/DocumentDetail';

//items
import Banner from './pages/items/Banner';
import Biodegradable from './pages/items/Biodegradable';
import Recycle from './pages/items/Recycle';

// mymage
import Member from './pages/mypage/Member';
import Manage from './pages/mypage/Manage';
import Order from './pages/mypage/Order';
import OrderList from './pages/mypage/OrderList';
import OfferList from './pages/mypage/OfferList';
import Qr from './pages/mypage/Qr';
import UserConfirm from './pages/mypage/UserConfirm';
import UserEdit from './pages/mypage/UserEdit';
import Withdraw from './pages/mypage/Withdraw';

// qr
import ValidateQR from './pages/qr/ValidateQR';
import QrSuccess from './pages/qr/QrSuccess';
import QrFailure from './pages/qr/QrFailure';

// 404 에러
import NotFoundPage from './pages/NotFoundPage';

import Tmp from './pages/Tmp';

export const handleTokenExpiration = (openModal) => {
  openModal({
    primaryText: '세션이 만료되었습니다.',
    context: '다시 로그인해주세요.',
    type: 'warning',
    onConfirm: () => {
      localStorage.clear(); // 로컬 스토리지 초기화
      window.location.href = '/signin'; // 로그인 페이지로 리다이렉트
    },
  });
};

function App() {
  // 현재 경로를 가져옴
  const location = useLocation();

  // 특정 경로에 따라 Navbar를 숨김
  const hideNavbarPaths = ['/mypage/qr/success', '/mypage/qr/failure'];

  // Navbar를 숨길지 여부를 결정하는 변수
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  const [isMainSixthVisible, setIsMainSixthVisible] = useState(false);

  const { openModal, RenderModal } = useModal();

  useEffect(() => {
    setOpenModal(openModal); // openModal 전달
  }, [openModal]);

  const handleScroll = () => {
    const sixthPage = document.getElementById('main-sixth-page');
    if (sixthPage) {
      const rect = sixthPage.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight; // 시작 부분에 도달하자마자 true
      setIsMainSixthVisible(isVisible);
    }
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token; // 토큰이 있으면 true 반환
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ModalProvider>
      <ScrollToTop />
      {!shouldHideNavbar && <Navbar />}
      <div className="h-screen">
        <Routes>
          {/* 메인페이지 */}
          <Route
            path="/"
            element={
              <>
                <MainFirstPage />
                {/* <MainFifthPage /> */}
                <MainSecondPage />
                <MainThirdPage />
                {/* <MainSixthPage isVisible={isMainSixthVisible} /> */}
                {/* <MainSeventhPage /> */}
                <MainFourthPage />
                {/* <SliderMainFourthPage /> */}
              </>
            }
          />
          {/* auth */}
          {/* 로그인 페이지 */}
          <Route path="/signin" element={<LoginPage />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignupPage />} />
          {/* 간편 로그인 추가 정보 입력 페이지 */}
          <Route path="socialinfo" element={<SocialInfoPage />} />
          {/* 로그인 찾기 페이지 */}
          <Route path="/idinquiry" element={<FindIdPage />} />
          {/* 로그인 찾기 페이지 - 성공 */}
          <Route path="/idinquiry/success" element={<FindIdSuccessPage />} />
          {/* 로그인 찾기 페이지 - 실패*/}
          <Route path="/idinquiry/failure" element={<FindIdFailurePage />} />
          {/* 비밀번호 찾기 페이지 */}
          <Route path="/pwinquiry" element={<FindPasswordPage />} />
          {/* 새로운 비밀번호 변경 페이지 */}
          <Route path="/pwinquiry/new" element={<ChangePasswordPage />} />
          {/* 소셜로그인 제외 개인정보처리방침 페이지 */}
          <Route
            path="/signup/termsAndPolicyNonSocial"
            element={<TermsAndPolicyNonSocial />}
          />
          {/* 소셜로그인 개인정보처리방침 페이지 */}
          <Route
            path="/signup/termsAndPolicySocial"
            element={<TermsAndPolicySocial />}
          />
          {/* 개인정보처리방침 페이지 */}
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          {/* 이용약관 페이지 */}
          <Route path="/termsOfUse" element={<TermsOfUse />} />

          {/* company */}
          {/* 회사 소개 페이지 */}
          <Route path="/company" element={<Company />} />
          {/* 연혁 페이지 */}
          <Route path="/history" element={<History />} />
          {/* 오시는 길 페이지 */}
          <Route path="/location" element={<Location />} />

          {/* cs */}
          {/* 자주 묻는 질문 페이지 */}
          <Route path="/faq" element={<Faq />} />
          {/* 1:1 문의 페이지 */}
          <Route path="/qna" element={<Qna />} />
          {/* 1:1 문의 글 등록 페이지 */}
          <Route
            path="/qna/register"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()}>
                <QnaRegister />
              </ProtectedRoute>
            }
          />
          {/* 1:1 문의 글 상세 페이지 */}
          <Route path="/qna/:pageNumber" element={<QnaDetail />} />

          {/* reference Room */}
          <Route path="/document/register" element={<DocumentRegister />} />
          {/* 인증서 페이지 */}
          <Route path="/certificate" element={<Certificate />} />
          {/* 성적서 페이지 */}
          <Route path="/coa" element={<Coa />} />
          {/* 보도 자료 페이지 */}
          <Route path="/press" element={<Press />} />
          {/* 기타 자료 페이지 */}
          <Route path="/extra" element={<Extra />} />
          {/* 자료실 상세 페이지 */}
          <Route path="/:type/:id" element={<DocumentDetail />} />

          {/* items */}
          {/* (아이템) 친환경 현수막 페이지 */}
          <Route path="/items/banner" element={<Banner />} />
          {/* (아이템) 생분해 제품 페이지 */}
          <Route path="/items/biodegradable" element={<Biodegradable />} />
          {/* (아이템) 재활용 제품 페이지 */}
          <Route path="/items/recycle" element={<Recycle />} />

          {/* mymage */}
          {/* 업체 관리 페이지 */}
          <Route
            path="/mypage/member"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()}>
                <Member />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/mypage/member" element={<Member />} /> */}
          {/* 현수막 관리 페이지 */}
          <Route path="/mypage/manage" element={<Manage />} />
          {/* 현수막 발주 페이지 - 발주 */}
          <Route path="/mypage/order" element={<Order />} />
          {/* 현수막 발주 페이지 - 발주 내역 */}
          <Route path="/mypage/orderlist" element={<OrderList />} />
          {/* 현수막 발주 페이지 - 발주 받은 내역 */}
          <Route path="/mypage/offerlist" element={<OfferList />} />
          {/* QR 발생기 페이지 */}
          <Route path="/mypage/qr" element={<Qr />} />
          {/* 회원 정보 확인 페이지 */}
          <Route path="/mypage/user" element={<UserConfirm />} />
          {/* 회원 정보 수정 페이지 */}
          <Route path="/mypage/user/edit" element={<UserEdit />} />
          {/* 탈퇴 페이지 */}
          <Route path="/mypage/withdraw" element={<Withdraw />} />

          {/* QR 유효성 확인 페이지 */}
          <Route path="/validateQR" element={<ValidateQR />} />
          {/* QR 발생기 확인 성공 페이지 */}
          <Route path="/mypage/qr/success" element={<QrSuccess />} />
          {/* QR 발생기 확인 실패 페이지 */}
          <Route path="/mypage/qr/failure" element={<QrFailure />} />

          <Route
            path="/jwt-header-oauth2" // 카카오 인증 후 돌아올 경로
            element={<OAuthRedirectHandler />}
          />

          {/* 404에러 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
          {/* 임시  페이지(삭제 예정) */}
          <Route path="/tmp" element={<Tmp />} />
        </Routes>
        <Footer />
        <RenderModal />
      </div>
    </ModalProvider>
  );
}

export default App;

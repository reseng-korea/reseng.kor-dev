import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// main
import MainFirstPage from './pages/main/MainFirstPage';
import MainSecondPage from './pages/main/MainSecondPage';
import MainThirdPage from './pages/main/MainThirdPage';
import MainFourthPage from './pages/main/MainFourthPage';

// auth
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import AddSignupPage from './pages/auth/AddSignUpPage';
import FindIdPage from './pages/auth/FindIdPage';
import FindIdSuccessPage from './pages/auth/FindIdSuccessPage';
import FindIdFailurePage from './pages/auth/FindIdFailurePage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

//company
import Company from './pages/company/Company';
import History from './pages/company/History';
import Location from './pages/company/Location';

//cs
import Faq from './pages/cs/Faq';
import Qna from './pages/cs/Qna';
import QnaRegister from './pages/cs/QnaRegister';

//reference Room
import Certificate from './pages/referenceRoom/certificate';
import Coa from './pages/referenceRoom/coa';
import Press from './pages/referenceRoom/press';

//item
import Banner from './pages/items/Banner';
import Biodegradable from './pages/items/Biodegradable';
import Recycle from './pages/items/Recycle';

// mymage
import Member from './pages/mypage/Member';
import Manage from './pages/mypage/Manage';
import Order from './pages/mypage/Order';
import Qr from './pages/mypage/Qr';
import UserConfirm from './pages/mypage/UserConfirm';
import UserEdit from './pages/mypage/UserEdit';
import Withdraw from './pages/mypage/Withdraw';

import Tmp from './pages/Tmp';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="h-screen">
        <Routes>
          {/* 메인페이지 */}
          <Route
            path="/"
            element={
              <>
                <MainFirstPage />
                <MainSecondPage />
                <MainThirdPage />
                <MainFourthPage />
                <Footer />
              </>
            }
          />
          {/* 로그인 페이지 */}
          <Route path="/signin" element={<LoginPage />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignupPage />} />
          {/* 간편 로그인 추가 정보 입력 페이지 */}
          <Route path="socialinfo" element={<AddSignupPage />} />
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
          {/* 회사 소개 페이지 */}
          <Route path="/company" element={<Company />} />
          {/* 연혁 페이지 */}
          <Route path="/history" element={<History />} />
          {/* 오시는 길 페이지 */}
          <Route path="/location" element={<Location />} />
          {/* 자주 묻는 질문 페이지 */}
          <Route path="/faq" element={<Faq />} />
          {/* 1:1 문의 페이지 */}
          <Route path="/qna" element={<Qna />} />
          {/* 1:1 문의 글 등록 페이지 */}
          <Route path="/qna/register" element={<QnaRegister />} />
          {/* 인증서 페이지 */}
          <Route path="/certificate" element={<Certificate />} />
          {/* 성적서 페이지 */}
          <Route path="/coa" element={<Coa />} />
          {/* 보도 자료 페이지 */}
          <Route path="/press" element={<Press />} />
          {/* (아이템) 친환경 현수막 페이지 */}
          <Route path="/items/banner" element={<Banner />} />
          {/* (아이템) 생분해 제품 페이지 */}
          <Route path="/items/biodegradable" element={<Biodegradable />} />
          {/* (아이템) 재활용 제품 페이지 */}
          <Route path="/items/recycle" element={<Recycle />} />
          {/* 업체 관리 페이지 */}
          <Route path="/mypage/member" element={<Member />} />
          {/* 현수막 관리 페이지 */}
          <Route path="/mypage/manage" element={<Manage />} />
          {/* 현수막 발주 페이지 */}
          <Route path="/mypage/order" element={<Order />} />
          {/* QR 발생기 페이지 */}
          <Route path="/mypage/qr" element={<Qr />} />
          {/* 회원 정보 확인 페이지 */}
          <Route path="/mypage/user" element={<UserConfirm />} />
          {/* 회원 정보 수정 페이지 */}
          <Route path="/mypage/user/edit" element={<UserEdit />} />
          {/* 탈퇴 페이지 */}
          <Route path="/mypage/withdraw" element={<Withdraw />} />
          {/* 임시  페이지(삭제 예정) */}
          <Route path="/tmp" element={<Tmp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

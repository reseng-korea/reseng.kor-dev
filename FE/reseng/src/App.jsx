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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

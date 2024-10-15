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
import FindIdPage from './pages/auth/FindIdPage';
import FindIdSuccessPage from './pages/auth/FindIdSuccessPage';
import FindIdFailurePage from './pages/auth/FindIdFailurePage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

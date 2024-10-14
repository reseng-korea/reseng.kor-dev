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
          <Route path="/login" element={<LoginPage />} />
          {/* 회원가입 페이지 */}
          <Route path="/signup" element={<SignupPage />} />
          {/* 로그인 찾기 페이지 */}
          <Route path="/id" element={<FindIdPage />} />
          {/* 비밀번호 찾기 페이지 */}
          <Route path="/password" element={<FindPasswordPage />} />
          {/* 비밀번호 찾기 페이지 */}
          <Route path="/change_password" element={<ChangePasswordPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

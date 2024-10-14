import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';

import MainFirstPage from './pages/MainFirstPage';
import MainSecondPage from './pages/MainSecondPage';
import MainThirdPage from './pages/MainThirdPage';
import MainFourthPage from './pages/MainFourthPage';
import Footer from './components/Footer';

import LoginPage from './pages/LoginPage';

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
              </>
            }
          />
          {/* 로그인페이지 */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

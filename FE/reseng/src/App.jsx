import { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';

import MainFirstPage from './pages/MainFirstPage';
import MainSecondPage from './pages/MainSecondPage';
import MainThirdPage from './pages/MainThirdPage';
import MainFourthPage from './pages/MainFourthPage';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <div className="h-screen">
        <MainFirstPage />
        <MainSecondPage />
        <MainThirdPage />
        <MainFourthPage />
        <Footer />
      </div>
    </>
  );
}

export default App;

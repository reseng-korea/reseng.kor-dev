import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import React, { useState } from 'react';

import leaf from '../../assets/faq_icon.png';
import faqData from '../data/faqData.json';

const Faq = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // 이미 열려있으면 닫기, 아니면 열기
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          {/* 하위 카테고리 */}
          <div className="mt-16 mb-6 text-3xl font-bold">고객 센터</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.faq)}
              className="flex items-center justify-center h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">자주 묻는 질문</span>
            </button>
            <button
              onClick={() => navigateTo(routes.qna)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">1:1 문의</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />

          {/* 메인 */}
          <div className="flex justify-center w-full">
            <div className="w-4/5 p-5">
              {faqData.map((faq, index) => (
                <div key={index}>
                  {/* 질문 */}
                  <div
                    onClick={() => toggleAnswer(index)}
                    className="flex items-center justify-between gap-x-4 px-6 py-5 mb-6 bg-white shadow-lg rounded-lg cursor-pointer"
                    style={{
                      borderLeftWidth: '14px',
                      borderLeftColor: '#2EA642',
                    }}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="text-2xl font-extrabold text-gray3">
                        Q
                      </div>
                      <div className="text-lg">{faq.question}</div>
                    </div>
                    <img src={leaf} className="w-8 h-8" />
                  </div>

                  {/* 답변 박스 (애니메이션 추가) */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      activeIndex === index
                        ? 'max-h-40 opacity-100 py-2'
                        : 'max-h-0 opacity-0 py-0'
                    }`}
                    style={{
                      transitionProperty: 'max-height, opacity, padding',
                    }}
                  >
                    <div className="flex justify-center gap-x-4 px-8 py-6 mb-12 bg-placeHolder shadow-lg rounded-lg cursor-pointer">
                      <div className="text-2xl font-extrabold text-primary">
                        A
                      </div>
                      <p className="text-left text-gray4">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;

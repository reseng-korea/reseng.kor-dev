import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import React, { useState } from 'react';

import faqData from '../data/faqData.json';

import leaf from '../../assets/faq_icon.png';

const Faq = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // 이미 열려있으면 닫기, 아니면 열기
  };

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen mt-16">
        <div className="w-full flex flex-col mb-1 space-x-2">
          {/* 하위 카테고리 */}
          <div className="text-3xl font-bold mb-6">고객 센터</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.faq)}
              className="w-30 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none"
            >
              <span className="text-[#2EA642] font-bold">자주 묻는 질문</span>
            </button>
            <button
              onClick={() => navigateTo(routes.qna)}
              className="w-30 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">1:1 문의</span>
            </button>
          </div>
          <hr className="w-full border-t border-[#99999] mb-6" />

          {/* 메인 */}
          <div className="w-full flex justify-center">
            <div className="w-4/5 p-5">
              {faqData.map((faq, index) => (
                <div key={index}>
                  {/* 질문 박스 */}
                  <div
                    onClick={() => toggleAnswer(index)}
                    className="flex items-center justify-between gap-x-4 cursor-pointer shadow-lg rounded-lg px-6 py-6 mb-6 bg-white"
                    style={{
                      borderLeftWidth: '14px',
                      borderLeftColor: '#2EA642',
                    }}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className="text-[#999999] text-2xl font-extrabold">
                        Q
                      </div>

                      <div className="text-xl">{faq.question}</div>
                    </div>
                    <img src={leaf} className="w-8 h-8" />
                  </div>

                  {/* 답변 박스 (애니메이션 추가) */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-40 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}`}
                    style={{
                      transitionProperty: 'max-height, opacity, padding',
                    }}
                  >
                    <div className="flex justify-center gap-x-4 cursor-pointer bg-gray-200 shadow-lg rounded-lg px-8 py-6 mb-12">
                      <div className="text-[#2EA642] text-2xl font-extrabold">
                        A
                      </div>
                      <p className="text-left text-gray-600">{faq.answer}</p>
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

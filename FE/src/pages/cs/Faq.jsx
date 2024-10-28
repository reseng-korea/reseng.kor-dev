import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import React, { useState } from 'react';

import leaf from '../../assets/faq_icon.png';
import faqData from '../../data/faqData.json';

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
        <div className="flex flex-col w-full slide-up">
          {/* 하위 카테고리 */}

          <div className="mt-16 mb-6 text-3xl font-bold">고객 센터</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.faq)}
              className="flex items-center justify-center w-40 h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">자주 묻는 질문</span>
            </button>
            <button
              onClick={() => navigateTo(routes.qna)}
              className="flex items-center justify-center w-40 h-10 border-none outline-none bg-transition"
            >
              <span className="text-black hover:text-primary">1:1 문의</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />

          {/* 메인 */}
          <div className="flex justify-center w-full">
            <div className="w-full p-5">
              {faqData.map((faq, index) => (
                <div key={index} className="mb-6">
                  {/* 질문 + 답변 카드 */}
                  <div
                    className={`bg-placeHolder rounded-lg transition-all duration-500`}
                  >
                    {/* 질문 */}
                    <div
                      onClick={() => toggleAnswer(index)}
                      className={`flex items-center justify-between rounded-lg gap-x-4 px-8 py-5 cursor-pointer hover:text-primary ${
                        activeIndex === index
                          ? 'bg-placeHolder'
                          : 'bg-placeHolder'
                      }`}
                      // style={{
                      //   borderLeftWidth: '14px',
                      //   borderLeftColor: '#2EA642',
                      // }}
                    >
                      <div className="flex items-center gap-x-8">
                        <div className="text-4xl font-extrabold text-primary">
                          Q
                        </div>
                        <div className="text-lg text-gray4 font-semibold">
                          {faq.question}
                        </div>
                      </div>
                      <img
                        src={leaf}
                        className={`w-8 h-8 transform transition-transform duration-500 ${
                          activeIndex === index ? 'rotate-181' : 'rotate-0'
                        }`}
                      />
                    </div>

                    {/* 답변 */}
                    <div
                      className={`overflow-hidden px-8 transition-all bg-white border border-placeHolder duration-500 ease-in-out ${
                        activeIndex === index
                          ? 'max-h-40 opacity-100 py-6 px-6 rounded-bl-lg rounded-br-lg'
                          : 'max-h-0 opacity-0 py-0 px-6'
                      }`}
                      style={{
                        transitionProperty: 'max-height, opacity, padding',
                      }}
                    >
                      <div className="flex gap-x-4 rounded-b-lg">
                        <div className="text-4xl font-extrabold text-re">A</div>
                        <p className="text-left text-gray4">{faq.answer}</p>
                      </div>
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

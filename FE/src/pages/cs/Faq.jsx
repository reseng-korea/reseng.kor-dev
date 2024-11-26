import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import leaf from '../../assets/faq_icon.png';
// import faqData from '../../data/faqData.json';

const Faq = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];

  const [faqs, setFaqs] = useState([]);

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // 이미 열려있으면 닫기, 아니면 열기
  };

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/faq`);
        const fetchedFaqs = response.data.data.content; // response 데이터 구조에 맞게 data를 가져옴
        setFaqs(fetchedFaqs);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFaqData();
  }, []);

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="자주 묻는 질문"
            mainCategory="고객 센터"
          />

          {/* 메인 */}
          <div className="flex justify-center w-full slide-down">
            <div className="w-full p-5">
              {faqs.map((faq, index) => (
                <div key={index} className="mb-6">
                  {/* 질문 + 답변 카드 */}
                  <div className="bg-placeHolder rounded-lg transition-all duration-500 hover:text-primary">
                    {/* 질문 */}
                    <div
                      onClick={() => toggleAnswer(index)}
                      className="flex items-center justify-between rounded-lg gap-x-4 px-8 py-5 cursor-pointer hover:text-primary group"
                    >
                      <div className="flex items-center gap-x-8">
                        <div className="text-4xl font-extrabold text-primary">
                          Q
                        </div>
                        <div
                          className={`text-lg text-left text-gray4 font-semibold group-hover:text-primary ${
                            activeIndex === index
                              ? 'text-primary'
                              : 'text-gray4'
                          }`}
                        >
                          {faq.title}
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
                      <div className="flex gap-x-8 rounded-b-lg">
                        <div className="text-4xl font-extrabold text-re">A</div>
                        <div className="flex items-center">
                          <p className="text-left text-gray4">{faq.content}</p>
                        </div>
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

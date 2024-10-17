import { useState } from 'react';

import Layout from '../../components/Layouts';
import { useNavigateTo } from '../../hooks/useNavigateTo';

const QnaRegister = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const [content, setContent] = useState('');
  const maxLength = 1500;

  const handleContent = (e) => {
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');

  const handleCheckboxChange = (e) => {
    setIsSecret(e.target.checked);
    if (!e.target.checked) {
      setPassword(''); // 비밀글 체크 해제 시 비밀번호 필드 초기화
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력되도록 제한하고, 최대 4자리까지만 허용
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPassword(value);
    }
  };

  return (
    <Layout>
      <div className="w-full flex justify-center px-3 py-2 min-h-screen mt-16">
        <div className="w-full max-w-full flex flex-col mb-1">
          {/* 하위 카테고리 */}
          <div className="text-3xl font-bold mb-6 text-center">고객 센터</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.faq)}
              className="w-40 h-10 bg-transition flex items-center justify-center hover:text-lg border-none outline-none focus:outline-none"
            >
              <span className="text-black">자주 묻는 질문</span>
            </button>
            <button
              onClick={() => navigateTo(routes.qna)}
              className="w-36 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-[#2EA642] rounded-none focus:outline-none"
            >
              <span className="text-[#2EA642] font-bold">1:1 문의</span>
            </button>
          </div>
          <hr className="w-full border-t border-[#99999] mb-6" />
          {/* 메인 */}
          <div className="flex flex-col items-center px-3 py-2">
            <label className="text-lg mb-2 self-start">제목</label>
            <input
              type="text"
              className="w-full border rounded-lg p-2 mb-1"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div className="flex flex-col items-center px-3 py-2">
            <label className="text-lg mb-2 self-start">내용</label>
            <textarea
              className="w-full border rounded-lg p-2 mb-1 resize-none"
              style={{ height: '16rem' }}
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={handleContent}
            />
            <span className="self-end text-sm">
              {content.length}/{maxLength}자
            </span>
          </div>
          <div className="flex flex-col px-3 py-2">
            {/* 비밀글 체크박스 */}
            <div className="flex flex-col items-start mb-4">
              <div className="flex">
                <input
                  type="checkbox"
                  id="secret"
                  checked={isSecret}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="secret" className="text-sm">
                  비밀글
                </label>
              </div>

              {/* 비밀글 체크 시 비밀번호 입력 필드 */}
              {isSecret && (
                <div className="flex justify-center items-center space-x-2 mt-2">
                  <label htmlFor="password" className="text-sm">
                    비밀번호 입력
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="border rounded-lg p-2 w-24 h-8"
                    placeholder="숫자 4자리"
                    maxLength="4"
                    inputMode="numeric"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="w-full mb-4 flex items-center justify-center px-3 py-2 space-x-4">
            <button
              type="submit"
              className="w-1/6 bg-[#2EA642] text-white font-bold py-2 px-4 rounded-lg hover:bg-white hover:text-[#2EA642] transition-colors duration-300"
            >
              등록
            </button>
            <button
              type="submit"
              className="w-1/6 bg-white border-[#2EA642] text-[#2EA642] font-bold py-2 px-4 rounded-lg hover:bg-[#2EA642] hover:text-white transition-colors duration-300"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QnaRegister;

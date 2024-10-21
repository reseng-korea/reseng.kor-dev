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
      <div className="flex justify-center min-h-screen px-3 py-2 w-full">
        <div className="flex flex-col w-full">
          {/* 하위 카테고리 */}
          <div className="mt-16 mb-6 text-3xl font-bold text-center">
            고객 센터
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.faq)}
              className="flex items-center justify-center h-10 border-none outline-none bg-transition hover:text-lg"
            >
              <span className="text-black">자주 묻는 질문</span>
            </button>
            <button
              onClick={() => navigateTo(routes.qna)}
              className="flex items-center justify-center h-10 border-0 border-b-2 border-primary bg-transition rounded-none"
            >
              <span className="font-bold text-primary">1:1 문의</span>
            </button>
          </div>
          <hr className="w-full mb-6 border-t border-gray1" />

          {/* 메인 */}
          <div className="flex flex-col items-center px-3 py-2">
            <label className="self-start mb-2 text-lg">제목</label>
            <input
              type="text"
              className="w-full p-2 mb-1 border rounded-lg"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div className="flex flex-col items-center px-3 py-2">
            <label className="self-start mb-2 text-lg">내용</label>
            <textarea
              className="w-full p-2 mb-1 border rounded-lg resize-none"
              style={{ height: '16rem' }}
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={handleContent}
            />
          </div>

          <div className="w-full flex justify-between items-center px-3">
            {/* 비밀글 체크박스 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="secret"
                checked={isSecret}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="secret" className="text-base">
                비밀글
              </label>
            </div>

            {/* 1500자 카운터 */}
            <span className="text-sm">
              {content.length}/{maxLength}자
            </span>
          </div>

          {isSecret && (
            <div className="flex items-center justify-start space-x-2 px-3">
              <label htmlFor="password" className="text-sm">
                비밀번호 입력
              </label>
              <input
                type="text"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-24 h-8 p-2 text-sm border rounded-lg"
                placeholder="숫자 4자리"
                maxLength="4"
                inputMode="numeric"
              />
            </div>
          )}

          <div className="flex items-center justify-center w-full px-3 py-2 mt-4 space-x-4">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg w-1/6 hover:bg-white hover:text-primary"
            >
              등록
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg w-1/6 hover:bg-primary hover:text-white"
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

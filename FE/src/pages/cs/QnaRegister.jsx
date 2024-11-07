import { useState } from 'react';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import useModal from '../../hooks/useModal';

const QnaRegister = () => {
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];

  const { openModal, closeModal, RenderModal } = useModal();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const maxLength = 1500;
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');

  // 제목
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  // 내용
  const handleContent = (e) => {
    if (e.target.value.length <= maxLength) {
      setContent(e.target.value);
    }
  };

  // 체크박스
  const handleCheckboxChange = (e) => {
    setIsSecret(e.target.checked);
    if (!e.target.checked) {
      setPassword(''); // 비밀글 체크 해제 시 비밀번호 필드 초기화
    }
  };

  // 비밀번호 입력
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // 숫자만 입력되도록 제한하고, 최대 4자리까지만 허용
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPassword(value);
    }
  };

  // 등록 버튼 클릭 시
  const handleSubmit = () => {
    if (!title) {
      console.log('1. QnaRegister에서 보낸다.');
      openModal({
        title: '제목을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => closeModal(),
      });
    } else if (!content) {
      openModal({
        title: '내용을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => closeModal(),
      });
    } else if (isSecret) {
      if (password.length != 4) {
        openModal({
          title: '비밀번호 4자리를 입력해주세요.',
          type: 'warning',
          isAutoClose: false,
          onConfirm: () => closeModal(),
        });
      }
    } else {
      openModal({
        title: '문의가 등록되었습니다.',
        type: 'success',
        isAutoClose: false,
        onConfirm: () => {
          closeModal();
          console.log('추후에 api 연결하고, 목록으로 가는거');
        },
      });
    }
  };

  const handleCancle = () => {
    if (title || content || isSecret || password.length !== 0) {
      openModal({
        title: '정말 취소하시겠습니까?',
        context: '입력하신 내용이 저장되지 않습니다.',
        type: 'warning',
        isAutoClose: true,
        onConfirm: () => console.log('확인 버튼 클릭됨'),
        onCancel: () => closeModal(), // closeModal을 명시적으로 호출
      });
    }
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2 w-full">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="1:1 문의"
            mainCategory="고객 센터"
          />

          {/* 메인 */}
          <div className="flex flex-col items-center px-3 py-2">
            <label className="self-start mb-2 text-lg">제목</label>
            <input
              type="text"
              value={title}
              onChange={handleTitle}
              className="w-full p-2 mb-1 border rounded-lg"
              placeholder="제목을 입력해주세요"
            />
          </div>
          <div className="flex flex-col items-center px-3 py-2">
            <label className="self-start mb-2 text-lg">내용</label>
            <textarea
              value={content}
              onChange={handleContent}
              className="w-full p-2 mb-1 border rounded-lg resize-none"
              style={{ height: '16rem' }}
              placeholder="내용을 입력해주세요"
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
              <label htmlFor="secret" className="text-md">
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
              <label htmlFor="password" className="text-md">
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
              onClick={handleSubmit}
              className="px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg w-1/6 hover:bg-hover"
            >
              등록
            </button>
            <button
              type="submit"
              onClick={handleCancle}
              className="px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg w-1/6 hover:border-hover hover:text-hover"
            >
              취소
            </button>
          </div>
        </div>
      </div>

      <RenderModal />
    </Layout>
  );
};

export default QnaRegister;

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import useModal from '../../hooks/useModal';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import usePreventRefresh from '../../hooks/usePreventRefresh';

const QnaRegister = () => {
  const location = useLocation();
  const data = location.state?.data || {};

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  const refreshtoken = localStorage.getItem('refreshToken');
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  const { navigateTo, routes } = useNavigateTo();

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();
  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const { questionId } = useParams(); // URL에서 id 가져오기 (없으면 undefined)

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const maxLength = 1500;
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');

  // id가 존재하면 수정 모드로 인식하여 데이터를 불러옴
  useEffect(() => {
    if (data && data.isModify) {
      console.log(data);
      console.log(data.title);
      console.log(data.isModify);
      setTitle(data.title);
      setContent(data.content);
      setIsSecret(data.secret);
    } else {
      console.log('데이터없니', data);
      console.log('데이터없니', data.isModify);
    }
  }, [data]);

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
  const handleSubmit = async () => {
    if (!title) {
      setModalOpen(true);
      openModal({
        primaryText: '제목을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (!content) {
      setModalOpen(true);
      openModal({
        primaryText: '내용을 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else if (isSecret && password.length != 4) {
      setModalOpen(true);
      openModal({
        primaryText: '비밀번호 4자리를 입력해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      // 수정 로직이라면
      if (data.isModify) {
        console.log(data.questionId);
        try {
          const response = await axios.put(
            `${apiUrl}/api/v1/qna/questions/${data.questionId}`,
            {
              title: title,
              content: content,
              isSecret: isSecret,
              password: password,
            },
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('수정 버튼 클릭', response);

          if (response.data.code == 201) {
            setModalOpen(true);
            openModal({
              primaryText: '문의가 수정되었습니다.',
              type: 'success',
              isAutoClose: true,
              onConfirm: () => {
                closeModal();
                setModalOpen(false);
                navigateTo(routes.qna);
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
        // 등록 로직이라면
      } else {
        try {
          const response = await axios.post(
            `${apiUrl}/api/v1/qna/questions`,
            {
              title: title,
              content: content,
              isSecret: isSecret,
              password: password,
            },
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log(response);

          if (response.data.code == 201) {
            setModalOpen(true);
            openModal({
              primaryText: '문의가 등록되었습니다.',
              type: 'success',
              isAutoClose: true,
              onConfirm: () => {
                closeModal();
                setModalOpen(false);
                navigateTo(routes.qna);
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleCancle = () => {
    console.log(title);
    if (!title && !content && !isSecret && password.length == 0) {
      navigateTo(routes.qna);
    } else {
      setModalOpen(true);
      openModal({
        primaryText: '정말 취소하시겠습니까?',
        context: '입력하신 내용이 저장되지 않습니다.',
        type: 'warning',
        isAutoClose: false,
        cancleButton: true,
        onConfirm: () => {
          setModalOpen(false);
          navigateTo(routes.qna);
        },
        onCancel: () => {
          closeModal();
          setModalOpen(false);
        },
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
              {data.isModify ? '수정' : '등록'}
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
      {modalOpen && <RenderModal />}
    </Layout>
  );
};

export default QnaRegister;

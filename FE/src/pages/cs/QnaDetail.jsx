import axios from 'axios';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import useModal from '../../hooks/useModal';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import { useParams, useLocation } from 'react-router-dom';

import { IoPersonSharp } from 'react-icons/io5';
import { IoTimeOutline } from 'react-icons/io5';
import { IoEye } from 'react-icons/io5';

const QnaDetail = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const location = useLocation();
  const {
    activePage,
    questionId,
    userId,
    title,
    content,
    representativeName,
    createdAt,
    viewCount,
    secret,
  } = location.state || {};

  console.log(viewCount);

  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  const { navigateTo, routes } = useNavigateTo();

  const { openModal, closeModal, RenderModal } = useModal();

  const { id } = useParams();

  const localUserId = localStorage.getItem('userId');
  console.log(localUserId);

  // 1:1 문의 글 수정 버튼 클릭 시
  const handleModifyPost = () => {
    navigateTo(routes.qnaRegist, {
      isModify: true,
      questionId,
      userId,
      title,
      content,
      representativeName,
      secret,
      // 비번
    });
  };

  // 1:1 문의 글 삭제 버튼 클릭 시
  const handleDeletePost = () => {
    openModal({
      primaryText: '이 글을 삭제하시겠습니까?',
      context: '삭제된 글은 복구할 수 없습니다.',
      type: 'warning',
      isAutoClose: false,
      cancleButton: true,
      buttonName: '취소',
      cancleButtonName: '삭제',
      onConfirm: () => closeModal(),
      onCancel: async () => {
        try {
          closeModal();
          const response = await axios.delete(
            `${apiUrl}/api/v1/qna/questions/${questionId}`,
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(response);
          console.log(response.data);

          if (response.data.code == 201) {
            openModal({
              primaryText: '삭제가 완료되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                navigateTo(routes.qna);
                closeModal();
              },
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage="1:1 문의"
            mainCategory="고객 센터"
          />

          {/* 메인 */}
          <div
            className="flex flex-col gap-x-6 items-center slide-up"
            // style={{ height: 'calc(100vh - 230px)' }}
          >
            {/* 질문 내용 */}
            <div className="flex flex-col flex-grow w-4/5 mb-4">
              <div className="flex flex-col">
                <span className="w-full mb-6 text-left text-3xl font-bold">
                  {title}
                </span>
                <div className="flex space-x-3">
                  <div className="flex space-x-2">
                    <IoPersonSharp className="w-5 h-5 text-gray3 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm md:text-md">
                      {representativeName}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <IoEye className="w-6 h-6 text-gray3 flex-shrink-0" />
                    <span className="truncate text-xs text-gray3 sm:text-sm md:text-md">
                      {viewCount}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <IoTimeOutline className="w-6 h-6 text-gray3 flex-shrink-0" />
                    <span className="truncate text-xs text-gray3 sm:text-sm md:text-md">
                      {createdAt}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="w-full mt-1 border-t border-gray2" />
              <div className="flex justify-start mt-12 min-h-[40vh]">
                {/* <div className="flex justify-start p-12 bg-primary"> */}
                <span className="text-left text-xs sm:text-sm md:text-md">
                  {content}
                </span>
              </div>
              <hr className="w-full mt-12 border-t border-gray2" />
            </div>
            {/* 1:1 문의 작성자가 상세 페이지에 들어왔을 때 */}
            <div className="flex flex-col w-4/5">
              {userId == localUserId && (
                <div className="flex space-x-2 justify-end items-end">
                  <button
                    onClick={handleModifyPost}
                    className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-primary hover:text-primary"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-warning hover:text-warning"
                  >
                    삭제
                  </button>
                </div>
              )}

              <div className="flex flex-col w-full justify-center mt-4">
                {/* 관리자 : 답변 등록 / 나머지 : 답변 목록 */}
                <span className="mb-4 font-bold text-left text-lg">
                  답변 등록
                </span>
                {/* 답변이 아직 없을 때 */}
                {/* <div className="flex w-full justify-center items-center min-h-[20vh]">
                  <div className="text-center text-md">
                    등록된 답변이 없습니다.
                  </div>
                </div> */}
                {/* 답변이 달렸을 때 */}
                <div className="flex flex-col w-full px-4 py-4 bg-placeHolder rounded-lg">
                  <div className="flex items-center space-x-2 m-4">
                    <span className="text-md text-gray4">관리자</span>
                    <span className="text-sm text-gray3">2024-11-08 12:24</span>
                  </div>
                  <div className="flex items-start m-4">
                    <span className="text-md text-left">
                      답변입니다답변입니다답변입니다답변입니다답변입니다답변입니다답변입니다
                      답변입니다답변입니다답변입니다답변입니다답변입니다답변입니다답변입니다
                      답변입니다답변입니다답변입니다답변입니다답변입니다답변입니다답변입니다
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 justify-end items-end mt-2">
                  <button className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-primary hover:text-primary">
                    수정
                  </button>
                  <button className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-warning hover:text-warning">
                    삭제
                  </button>
                </div>
                {/* 관리자만 보이는 답변 달기 기능 */}
                {/* <div className="flex flex-col w-full px-4 py-4 bg-placeHolder rounded-lg">
                  <textarea
                    // value={content}
                    // onChange={handleContent}
                    className="w-full p-2 mb-2 border rounded-lg resize-none"
                    style={{ height: '8rem' }}
                    placeholder="내용을 입력해주세요"
                  />
                  <div className="flex justify-end">
                    <button className="px-4 py-3 font-bold text-white transition-colors duration-300 bg-primary hover:bg-hover text-xs sm:text-sm md:text-md rounded-lg">
                      답변 등록
                    </button>
                  </div>
                </div> */}
              </div>
              <hr className="w-full mt-12 mb-12 border-t border-gray2" />
              <div className="flex w-full justify-center mt-4">
                <button
                  onClick={() => navigateTo(`${routes.qna}?page=${activePage}`)}
                  className="w-1/6 px-4 py-3 justify-center font-bold text-white transition-colors duration-300 bg-primary hover:bg-hover text-xs sm:text-sm md:text-md rounded-lg"
                >
                  목록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default QnaDetail;

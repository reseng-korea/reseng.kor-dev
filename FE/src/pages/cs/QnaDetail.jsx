import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import useModal from '../../hooks/useModal';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import { useParams } from 'react-router-dom';

import { IoPersonSharp } from 'react-icons/io5';
import { IoTimeOutline } from 'react-icons/io5';
import { IoEye } from 'react-icons/io5';

const QnaDetail = () => {
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  const { navigateTo, routes } = useNavigateTo();

  const { openModal, closeModal, RenderModal } = useModal();

  const { id } = useParams();

  const handleDeletePost = () => {
    openModal({
      title: '이 글을 삭제하시겠습니까?',
      context: '삭제된 글은 복구할 수 없습니다.',
      type: 'warning',
      isAutoClose: false,
      cancleButton: true,
      buttonName: '취소',
      cancleButtonName: '삭제',
      onConfirm: () => closeModal(),
      onCancel: () => {
        console.log(
          '삭제 api 연결하고, 삭제 됐을 때 삭제 됐다는 모달창 띄우기'
        );
        closeModal();
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
            className="flex flex-col gap-x-6 items-center"
            // style={{ height: 'calc(100vh - 230px)' }}
          >
            {/* 질문 내용 */}
            <div className="flex flex-col flex-grow w-4/5 mb-4">
              <div className="flex flex-col">
                <span className="w-full mb-6 text-left text-3xl font-bold">
                  제목입니다제목입니다
                </span>
                <div className="flex space-x-3">
                  <div className="flex space-x-2">
                    <IoPersonSharp className="w-5 h-5 text-gray3 flex-shrink-0" />
                    <span className="truncate text-xs sm:text-sm md:text-md">
                      김나연
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <IoEye className="w-6 h-6 text-gray3 flex-shrink-0" />
                    <span className="truncate text-xs text-gray3 sm:text-sm md:text-md">
                      3
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <IoTimeOutline className="w-6 h-6 text-gray3 flex-shrink-0" />
                    <span className="truncate text-xs text-gray3 sm:text-sm md:text-md">
                      24-11-07 22:29
                    </span>
                  </div>
                </div>
              </div>
              <hr className="w-full mt-1 border-t border-gray2" />
              <div className="flex justify-start mt-12 min-h-[40vh]">
                {/* <div className="flex justify-start p-12 bg-primary"> */}
                <span className="text-left text-xs sm:text-sm md:text-md">
                  내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다
                  내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다
                  내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다
                </span>
              </div>
              <hr className="w-full mt-12 border-t border-gray2" />
            </div>
            {/* 버튼 */}
            <div className="flex flex-col w-4/5">
              <div className="flex space-x-2 justify-end items-end">
                <button
                  onClick={handleDeletePost}
                  className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-primary hover:text-primary"
                >
                  삭제
                </button>
                <button
                  onClick={() => navigateTo(routes.qnaRegist)}
                  className="px-4 py-2 text-gray3 transition-colors duration-300 border border-gray3 text-xs sm:text-sm md:text-md rounded-lg hover:border-primary hover:text-primary"
                >
                  수정
                </button>
              </div>
              <div className="flex w-full justify-center mt-4">
                <button
                  onClick={() => navigateTo(routes.qna)}
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

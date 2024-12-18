import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import { useParams } from 'react-router-dom';

import { IoPersonSharp } from 'react-icons/io5';

const QnaDetail = () => {
  const navItems = [
    { label: '자주 묻는 질문', route: '/faq' },
    { label: '1:1 문의', route: '/qna' },
  ];
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  const { id } = useParams();

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
            {/* 네모박스 */}
            <div className="flex flex-col flex-grow w-4/5 bg-transition border border-black rounded-lg mb-4">
              <div className="flex justify-between p-6 space-x-12 bg-placeHolder rounded-lg">
                <span className="w-full text-left text-lg font-bold">
                  제목입니다제목입니다
                </span>
                <div className="flex items-center justify-end space-x-2 w-[30%]">
                  <IoPersonSharp className="w-6 h-6 text-gray2 flex-shrink-0" />
                  <span className="truncate text-xs sm:text-sm md:text-md">
                    이름
                  </span>
                </div>
              </div>
              <hr className="w-full border-t border-black" />
              <div className="flex justify-start space-x-4 p-6">
                <span className="text-xs sm:text-sm md:text-md">
                  2024.10.17
                </span>
                <span className="text-xs sm:text-sm md:text-md">|</span>
                <span className="text-xs sm:text-sm md:text-md">조회수(1)</span>
              </div>

              <div className="flex justify-start p-10 min-h-[40vh]">
                {/* <div className="flex justify-start p-12 bg-primary"> */}
                <span className="text-left text-xs sm:text-sm md:text-md">
                  내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다
                  내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다내용입니다
                  내용입니다
                </span>
              </div>
            </div>

            {/* 버튼들 */}
            <div className="flex w-4/5 justify-between mt-4 mb-4">
              <div className="flex space-x-2">
                <button className="px-4 py-2 font-bold text-gray4 transition-colors duration-300 bg-white border border-gray4 text-xs sm:text-sm md:text-md rounded-lg hover:bg-white hover:text-primary">
                  삭제
                </button>
                <button
                  onClick={() => navigateTo(routes.qnaRegist)}
                  className="px-4 py-2 font-bold text-gray4 transition-colors duration-300 bg-white border border-gray4 text-xs sm:text-sm md:text-md rounded-lg hover:bg-white hover:text-primary"
                >
                  수정
                </button>
              </div>
              <button className=" px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary text-xs sm:text-sm md:text-md rounded-lg hover:bg-white hover:text-primary">
                목록
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QnaDetail;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { useSearchParams } from 'react-router-dom';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import { useNavigateTo } from '../../hooks/useNavigateTo';
import { formatDate } from '../../utils/dateUtils';

import resengLogo from '../../assets/reseng_logo.png';

const Cerificate = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { navigateTo, routes } = useNavigateTo();
  const role = localStorage.getItem('role');

  const [certificate, setCertificate] = useState([]);

  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const activePage = parseInt(searchParams.get('page')) || 1;
  const itemsCountPerPage = 6;

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber }); // 페이지 번호를 URL 쿼리 파라미터에 설정
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/documents/CERTIFICATE?page=${activePage - 1}&size=${itemsCountPerPage}`
        );

        console.log(response);
        setTotalElements(response.data.data.totalElements);

        const data = response.data.data.content;
        setCertificate(data);
        console.log(certificate);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [activePage]);

  const handleRowClick = async (index, documentId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/documents/CERTIFICATE/${documentId}`
      );

      console.log(response);

      if (response.data.code == 200) {
        handleResponse(response.data.data, index);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Documentdetail 페이지로 데이터 보내는 함수 및 페이지 이동
  const handleResponse = (data, index) => {
    const { id, title, content, createdAt, date, type, files = [] } = data;
    // fileId를 제외한 나머지 필드만 추출
    const processedFiles = files.map(({ fileId, ...rest }) => rest);

    navigateTo(
      routes.documentDetail.replace(':type', 'certificate').replace(':id', id),
      {
        activePage,
        id,
        title,
        content,
        date,
        type,
        createdAt: createdAt ? formatDate(createdAt) : '',
        files: processedFiles,
        isFromNavigation: true, //페이지 이동 표시
      }
    );
  };

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          <SubNavbar
            items={navItems}
            activePage="인증서"
            mainCategory="자료실"
          />
          {/* 메인 */}
          <div className="flex flex-col mb-12 slide-down">
            <div className="flex flex-wrap w-full justify-center">
              {certificate.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() =>
                    handleRowClick(
                      totalElements -
                        index -
                        (activePage - 1) * itemsCountPerPage,
                      item.id
                    )
                  }
                  className="flex flex-col w-full sm:w-2/5 md:w-1/4 lg:w-2/7 items-center px-6 py-8 border border-gray3 rounded-lg mx-4 my-2"
                >
                  {/* 이미지 영역 */}
                  <div className="flex justify-center items-center h-36">
                    <img
                      className="max-w-full max-h-full object-contain"
                      src={item.thumbnailUrl || resengLogo}
                      alt={item.title}
                    />
                  </div>
                  {/* 텍스트 영역 */}
                  <div className="w-full mt-4 text-center">
                    <span className="text-lg font-bold">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              activePage={activePage} //현재 페이지
              itemsCountPerPage={itemsCountPerPage} // 페이지 당 항목 수(10개)
              totalItemsCount={totalElements} // 표시할 항목의 총 개수(전체)
              pageRangeDisplayed={5} //페이지네이터의 페이지 범위
              hideFirstLastPages={true}
              prevPageText="<"
              // firstPageText="≪"
              nextPageText=">"
              // lastPageText="≫"
              onChange={handlePageChange}
              innerClass="flex justify-center mt-4"
              activeClass="text-white bg-primary rounded-full"
              activeLinkClass="!text-white hover:!text-white" // 활성화된 페이지 스타일 ( 숫자 부분)
              itemClass="group inline-block px-4 py-2 border rounded-full text-gray4 mt-4 mx-0.5 hover:text-primary hover:border-primary" // 페이지 번호 스타일
              linkClass="group-hover:text-primary text-gray4" // 링크의 기본 스타일
            />
            {role === 'ROLE_MANAGER' && (
              <div className="flex justify-end mt-12 mb-12">
                <button
                  type="submit"
                  onClick={() =>
                    navigateTo(routes.documentRegister, {
                      documentType: 'CERTIFICATE',
                    })
                  }
                  className="px-8 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg hover:bg-hover"
                >
                  인증서 등록
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cerificate;

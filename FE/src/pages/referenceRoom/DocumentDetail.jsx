import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import useModal from '../../hooks/useModal';
import { useNavigateTo } from '../../hooks/useNavigateTo';

import { IoMdDownload } from 'react-icons/io';

const DocumentDetail = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const { navigateTo, routes } = useNavigateTo();
  const { openModal, closeModal, RenderModal } = useModal();
  const [modalOpen, setModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');
  const localUserId = localStorage.getItem('userId');
  const role = localStorage.getItem('role');

  const location = useLocation();
  const initialData = location.state || {};
  const [documentData, setDocumentData] = useState(initialData);

  // console.log(initialData);
  // console.log(documentData);
  // console.log(documentData.files);

  const activePageText = (() => {
    switch (documentData.type) {
      case 'NEWS':
        return '보도 자료';
      case 'CERTIFICATE':
        return '인증서';
      case 'GRADE':
        return '성적서';
      default:
        return '인증서'; // 기본값
    }
  })();

  // 목록 페이지로 이동
  const routeMap = {
    CERTIFICATE: routes.certificate,
    GRADE: routes.coa,
    NEWS: routes.press,
  };

  const handleNavigate = () => {
    const route = routeMap[documentData.type];
    navigateTo(route);
  };

  // 자료실 글 수정 버튼 클릭 시
  const handleModifyPost = () => {
    navigateTo(routes.documentRegister, {
      data: {
        isModify: true,
        ...documentData,
      },
    });
  };

  // 자료실 글 삭제 버튼 클릭 시
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
            `${apiUrl}/api/v1/documents/${documentData.type}/${documentData.id}`,
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.data.code == 201) {
            openModal({
              primaryText: '삭제가 완료되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                closeModal();
                handleNavigate();
              },
            });
          }
        } catch (error) {
          // console.log(error);
        }
      },
    });
  };

  // 파일 다운로드
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/documents/download/${documentData.type}/${fileId}`,

        {
          headers: {
            Authorization: accesstoken,
          },
          responseType: 'blob',
        }
      );
      // console.log(response);

      // const blob = new Blob([response.data], {
      //   type: response.headers['content-type'],
      // });
      // const url = window.URL.createObjectURL(blob);
      // console.log(url);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = fileName;
      // link.click();
      // window.URL.revokeObjectURL(url);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full">
          <SubNavbar
            items={navItems}
            activePage={activePageText}
            mainCategory="자료실"
          />
          {/* 내용 */}
          <div className="flex flex-col gap-x-6 items-center slide-up mt-6 mb-24">
            {/* 제목 */}
            <span className="text-2xl font-bold">{documentData.title}</span>
            {documentData.type === 'NEWS' ? (
              <span className="text-gray3 mt-4">{documentData.date}</span>
            ) : (
              <span className="text-gray3 mt-4">{documentData.createdAt}</span>
            )}
            <hr className="w-full mt-6 mb-6 border border-gray3" />

            {/* 내용 */}
            <div className="parent-container">
              <div dangerouslySetInnerHTML={{ __html: documentData.content }} />
            </div>
          </div>

          {/* 첨부 파일 유무 */}
          {documentData?.files?.length > 0 && (
            <div className="flex flex-col w-full">
              <h3 className="text-left font-bold mb-4">
                첨부한 파일{' '}
                <span className="text-primary">
                  {' '}
                  ({documentData.files.length}개)
                </span>
              </h3>

              {documentData.files.map((file, index) => (
                <div
                  key={file.fileName || index}
                  onClick={() => handleDownload(file.fileId, file.fileName)}
                  // onClick={() => handleDownload()}
                  className="flex px-8 py-8 justify-between items-center bg-placeHolder w-full rounded-md mb-2"
                >
                  <span className="text-md text-gray4 hover:text-gray3">
                    {file.fileName}
                  </span>
                  <IoMdDownload className="text-2xl text-gray3 hover:text-gray4" />
                </div>
              ))}
            </div>
          )}

          <hr className="w-full mt-12 border-t border-gray2" />
          {role === 'ROLE_MANAGER' && (
            <div className="flex space-x-2 justify-end items-end mt-2">
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
          {/* 목록 */}
          <div className="flex items-center justify-center mt-4 mb-12">
            <button
              onClick={handleNavigate}
              type="submit"
              className="px-8 py-2 font-bold border border-primary transition-colors duration-300 rounded-3xl hover:bg-white hover:text-primary"
            >
              목록
            </button>
          </div>
        </div>
      </div>
      <RenderModal />
    </Layout>
  );
};

export default DocumentDetail;

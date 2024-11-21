import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';
Quill.register('modules/ImageResize', ImageResize);
import dompurify from 'dompurify';

import { useNavigateTo } from '../../hooks/useNavigateTo';
import useModal from '../../hooks/useModal';
import usePreventRefresh from '../../hooks/usePreventRefresh';
import { handleFileUpload } from '../../utils/QuillHander';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import QuillModule from '../../components/QuillModule';

import { MdCancel } from 'react-icons/md';
import { GiConsoleController } from 'react-icons/gi';

const DocumentRegister = () => {
  const location = useLocation();
  const documentData = location.state?.data || {};
  const documentType = documentData.isModify
    ? location.state?.data?.type // Detail 페이지에서 전달된 데이터
    : location.state?.documentType || ''; // Certificate 페이지에서 전달된 데이터

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // 이미지, 파일 정보 저장
  const [displayFiles, setDisplayFiles] = useState([]); //파일 정보만 저장

  const [selectedDate, setSelectedDate] = useState(''); //보도자료 기사 작성 날짜
  const quillRef = useRef(null);

  // id가 존재하면 수정 모드로 인식하여 데이터를 불러옴
  useEffect(() => {
    if (documentData && documentData.isModify) {
      setTitle(documentData.title);
      setContent(documentData.content);
      setUploadedFiles(documentData.files);
    }
  }, [documentData]);

  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];
  const { navigateTo, routes } = useNavigateTo();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');

  const [modalOpen, setModalOpen] = useState(false);
  const { openModal, closeModal, RenderModal } = useModal();

  const sanitizer = dompurify.sanitize;

  // 새로고침 데이터 날라감 방지
  usePreventRefresh(openModal, closeModal, setModalOpen);

  const activePageText = (() => {
    switch (documentType) {
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

  const formats = useMemo(
    () => [
      'header',
      'size',
      'font',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'bullet',
      'indent',
      'link',
      'image',
      'color',
      'background',
      'align',
      'script',
      'code-block',
      'clean',
    ],
    []
  );

  // 이미지 추가할 때마다 서버에 저장 요청
  const ImageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          console.log(documentType);
          const response = await axios.post(
            `${apiUrl}/api/v1/s3/upload/${documentType}`,
            formData,
            {
              headers: {
                Authorization: accesstoken,
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          console.log(response);
          const fileUrl = response.data.data.fileUrl;
          const fileType = response.data.data.fileType;
          const fileName = response.data.data.fileName;

          // 파일 정보를 상태에 저장
          setUploadedFiles((prevFiles) => [
            ...prevFiles,
            { fileUrl, fileType, fileName },
          ]);

          const editor = quillRef.current.getEditor(); // Quill 인스턴스 가져오기
          const range = editor.getSelection(); // 현재 커서 위치 가져오기

          // 이미지 삽입
          editor.insertEmbed(range.index, 'image', fileUrl);
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
        handlers: {
          image: ImageHandler,
          // 'attach-file': () =>
          //   handleFileUpload(quillRef, apiUrl, documentType, accesstoken),
        },
      },
      ImageResize: {
        parchment: Quill.import('parchment'),
        // modules: ['Resize', 'DisplaySize'],
      },
    }),
    []
  );

  // 목록 페이지로 이동
  const routeMap = {
    CERTIFICATE: routes.certificate,
    GRADE: routes.coa,
    NEWS: routes.press,
  };

  const handleNavigate = () => {
    const route = routeMap[documentType];
    navigateTo(route);
  };

  // 제목 입력
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  // 내용 입력
  const handleContent = (value) => {
    setContent(value);
    // console.log(value);
  };

  // 날짜 입력
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log('Selected Date:', event.target.value);
  };

  // 글 등록
  const handleSubmit = async () => {
    console.log('제목', title);
    console.log('내용', content);

    const data = {
      title: title,
      date: selectedDate,
      content: content,
      files: uploadedFiles,
    };

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
    } else if (documentType === 'NEWS' && !selectedDate) {
      setModalOpen(true);
      openModal({
        primaryText: '게시 날짜를 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      // 수정 로직이라면
      console.log('수정일 때, 데이터 확인', data);
      if (documentData.isModify) {
        try {
          const response = await axios.put(
            `${apiUrl}/api/v1/documents/${documentType}/${documentData.id}`,
            data,
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
              primaryText: '글이 성공적으로 수정되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                closeModal();
                setModalOpen(false);
                handleNavigate();
              },
            });
          }
        } catch (error) {
          setModalOpen(true);
          openModal({
            primaryText: '글 수정에 실패했습니다.',
            context: '잠시 후 다시 시도해주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal();
              setModalOpen(false);
              handleNavigate();
            },
          });
        }

        // 등록 로직이라면
      } else {
        try {
          const response = await axios.post(
            `${apiUrl}/api/v1/documents/${documentType}`,
            data,
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
              primaryText: '글이 성공적으로 등록되었습니다.',
              type: 'success',
              isAutoClose: false,
              onConfirm: () => {
                closeModal();
                setModalOpen(false);
                handleNavigate();
              },
            });
          }
        } catch (error) {
          setModalOpen(true);
          openModal({
            primaryText: '글 등록에 실패했습니다.',
            context: '잠시 후 다시 시도해주세요.',
            type: 'warning',
            isAutoClose: false,
            onConfirm: () => {
              closeModal();
              setModalOpen(false);
              handleNavigate();
            },
          });
        }
      }
    }
  };

  // 글 등록 취소
  const handleCancel = () => {
    if (!title && !content) {
      handleNavigate();
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
          handleNavigate();
        },
        onCancel: () => {
          closeModal();
          setModalOpen(false);
        },
      });
    }
  };

  // 파일 확인 및 다운로드
  const handleConfirm = async () => {
    const fileName =
      'certificate/b0a85319-02b2-4df2-b5b1-8d052579ffe1tree.jpeg';

    console.log('access', accesstoken);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/s3/download?fileName=${fileName}`,
        {
          headers: {
            Authorization: accesstoken,
          },
          responseType: 'blob',
        }
      );
      console.log(response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName.split('/').pop()); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  // 파일 삭제
  const handleDelete = async (fileName) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/s3?fileName=${fileName}`,
        {
          headers: {
            Authorization: accesstoken,
          },
          // responseType: 'blob',
        }
      );

      console.log(response);

      setUploadedFiles((prevFiles) =>
        prevFiles.filter((file) => file.fileName !== fileName)
      );

      setDisplayFiles((prevFiles) =>
        prevFiles.filter((file) => file.fileName !== fileName)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 이미지 크기 찾기
  // useEffect(() => {
  //   if (quillRef.current) {
  //     const editor = quillRef.current.getEditor(); // ReactQuill에서 Quill 인스턴스 가져오기
  //     editor.on('text-change', () => {
  //       const editorContainer = editor.root; // Quill 편집 영역의 root 컨테이너
  //       if (!editorContainer) {
  //         console.error('Editor container is not available.');
  //         return;
  //       }

  //       const images = editorContainer.querySelectorAll('img'); // 이미지 태그 찾기
  //       images.forEach((img, index) => {
  //         const width = img.style.width || img.getAttribute('width') || 'auto';
  //         const height =
  //           img.style.height || img.getAttribute('height') || 'auto';

  //         // 실제 렌더링된 크기 가져오기
  //         const { width: renderedWidth, height: renderedHeight } =
  //           img.getBoundingClientRect();

  //         console.log(
  //           `Image ${index + 1}: Width (style): ${width}, Height (style): ${height}`
  //         );
  //         console.log(
  //           `Image ${index + 1}: Rendered Width: ${renderedWidth}px, Rendered Height: ${renderedHeight}px`
  //         );
  //       });
  //     });
  //   }
  // }, []);

  // 모든 이미지 동일하게 설정
  // const handleSameSize = () => {
  //   if (quillRef.current) {
  //     const editor = quillRef.current.getEditor();
  //     const editorContainer = editor.root; // Quill 편집 영역의 root 컨테이너
  //     const images = editorContainer.querySelectorAll('img'); // 모든 이미지 찾기

  //     // 모든 이미지 크기 동일하게 설정
  //     images.forEach((img) => {
  //       img.style.width = '200px';
  //       img.style.height = '200px';
  //     });

  //     console.log('All images resized to 200x200px');
  //   }
  // };

  console.log(uploadedFiles.length);

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full slide-up">
          <SubNavbar
            items={navItems}
            activePage={activePageText}
            mainCategory="자료실"
          />
          <div className="flex items-start">
            <input
              type="text"
              value={title}
              onChange={handleTitle}
              placeholder="제목을 입력하세요"
              className="w-full mt-4 mb-4 text-4xl text-left placeholder:text-gray2"
            />
          </div>
          <hr className="w-full mb-4 border-t border-gray1" />
          {documentType === 'NEWS' && (
            <div className="text-left mb-4">
              <label className="font-bold" htmlFor="date-input">
                보도 자료 발행 날짜 :{' '}
              </label>
              <input
                type="date"
                id="date-input"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
          )}

          <div>
            <div id="toolBar">
              <QuillModule />
            </div>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={content}
              onChange={handleContent}
              style={{ height: '600px' }}
              ref={quillRef}
            />
            <div className="flex flex-col">
              <div className="mt-4 mb-2 text-left text-lg font-bold w-fit">
                파일 첨부
              </div>
              <span className="text-gray3 text-left">
                XXX MB 이하의 파일만 업로드 가능합니다.
              </span>
              <div
                onClick={() =>
                  handleFileUpload(
                    apiUrl,
                    documentType,
                    accesstoken,
                    setUploadedFiles,
                    setDisplayFiles
                  )
                }
                className="bg-white mt-4 mb-4 p-3 rounded-lg border border-primary text-primary hover:bg-hoverLight w-fit"
              >
                파일 선택
              </div>

              {displayFiles.length > 0 && (
                <div className="flex flex-col space-y-2">
                  {displayFiles.map((file, index) => (
                    <div className="flex px-4 py-2 space-x-2 justify-center items-center bg-white border border-gray2 w-fit rounded-full">
                      <span className="text-xs text-gray3">
                        {file.fileName}
                      </span>
                      <MdCancel
                        onClick={() => handleDelete(file.fileName)}
                        className="text-gray3 text-2xl"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full flex justify-between" id="content">
              <div className="w-1/2">{content}</div>
              <div
                className="w-1/2"
                dangerouslySetInnerHTML={{ __html: sanitizer(`${content}`) }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center w-full px-3 py-2 mt-4 space-x-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg w-1/6 hover:bg-hover"
            >
              {documentData.isModify ? '수정' : '등록'}
            </button>
            <button
              type="submit"
              onClick={handleCancel}
              className="px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg w-1/6 hover:border-hoverLight hover:bg-hoverLight"
            >
              취소
            </button>
            <button
              type="submit"
              onClick={handleConfirm}
              className="px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg w-1/6 hover:border-hoverLight hover:bg-hoverLight"
            >
              이미지 다운
            </button>
            <button
              type="submit"
              onClick={handleDelete}
              className="px-4 py-2 font-bold text-primary transition-colors duration-300 bg-white border-primary rounded-lg w-1/6 hover:border-hoverLight hover:bg-hoverLight"
            >
              이미지 삭제
            </button>
          </div>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </Layout>
  );
};

export default DocumentRegister;

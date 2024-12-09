import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import apiClient from '../../services/apiClient';

// import ImageResize from 'quill-image-resize-module-react';
// Quill.register('modules/imageResize', ImageResize);

import ImageResize from 'quill-image-resize';
Quill.register('modules/imageResize', ImageResize);
window.Quill = Quill;

// CustomVideoBlot 등록
const BlockEmbed = Quill.import('blots/block/embed');

class CustomVideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value);
    node.setAttribute('class', 'ql-video');
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    node.setAttribute('style', `
      aspect-ratio: 16/9;
      width: 70%;
      max-width: 800px;
      height: auto;
      margin: 20px auto;
      display: block;
    `);
    return node;
  }

  static value(node) {
    return node.getAttribute('src');
  }
}

CustomVideoBlot.blotName = 'customVideo';
CustomVideoBlot.tagName = 'iframe'; // YouTube에서 iframe을 사용해야 동작
Quill.register(CustomVideoBlot);

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
  console.log(documentData);
  const documentType = documentData.isModify
    ? location.state?.data?.type // Detail 페이지에서 전달된 데이터
    : location.state?.documentType || ''; // Certificate 페이지에서 전달된 데이터

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // 파일 정보 저장
  const [imageFiles, setImageFiles] = useState([]); //html 태그 내의 이미지 정보 저장

  const [selectedDate, setSelectedDate] = useState(''); //보도자료 기사 작성 날짜
  const quillRef = useRef(null);

  // id가 존재하면 수정 모드로 인식하여 데이터를 불러옴
  useEffect(() => {
    console.log('수정');
    console.log(documentData.images);
    if (documentData && documentData.isModify) {
      setTitle(documentData.title);
      setContent(documentData.content);
      setUploadedFiles(documentData.files);
      setImageFiles(documentData.images);
      setSelectedDate(documentData.date);
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
      // 'bullet',
      'indent',
      'link',
      'image',
      'video',
      'customVideo',
      'color',
      'background',
      'align',
      'script',
      'code-block',
      // 'clean',
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

      console.log('파일 이름:', file.name); // 파일 이름
      console.log('파일 크기:', (file.size / 1024).toFixed(2) + ' KB'); // 파일 크기 (KB 단위)
      console.log('파일 유형:', file.type); // 파일 MIME 타입

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          console.log(documentType);
          const response = await apiClient.post(
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
          setImageFiles((prevFiles) => [
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

  const VideoHandler = () => {
    const videoUrl = prompt('YouTube 동영상 URL을 입력하세요:');
    
    if (videoUrl) {
      // YouTube URL 형식 처리 개선
      let embedUrl = videoUrl;
      
      // youtube.com/watch?v= 형식 처리
      if (videoUrl.includes('watch?v=')) {
        embedUrl = videoUrl.replace('watch?v=', 'embed/');
      }
      // youtu.be/ 형식 처리
      else if (videoUrl.includes('youtu.be/')) {
        embedUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
      }
      
      // http:// 또는 https:// 가 없는 경우 추가
      if (!embedUrl.match(/^https?:\/\//)) {
        embedUrl = 'https://' + embedUrl;
      }

      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      
      try {
        // 비디오 삽입 전에 줄바꿈 추가
      editor.insertText(range.index, '\n');
      
      // 비디오 삽입
      editor.insertEmbed(range.index + 1, 'customVideo', embedUrl);
      
      // 비디오 삽입 후 줄바꿈 추가
      editor.insertText(range.index + 2, '\n');
      
      // 커서를 비디오 다음으로 이동
      editor.setSelection(range.index + 3, 0);
      
      console.log('Video embedded:', embedUrl);
      } catch (error) {
        console.error('Error embedding video:', error);
      }
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
        handlers: {
          image: ImageHandler,
          video: VideoHandler,
        },
      },
      imageResize: {
        parchment: Quill.import('parchment'),
        // modules: ['Resize', 'DisplaySize'],
      },
    }),
    []
  );

  // Delete 키로 이미지 삭제 핸들러 추가
  // useEffect(() => {
  //   if (quillRef.current) {
  //     const quill = quillRef.current.getEditor();

  //     // Quill keyboard.addBinding 방식
  //     quill.keyboard.addBinding(
  //       { key: 'Delete' },
  //       {
  //         collapsed: true,
  //         handler(range, context) {
  //           const [image] = quill.getLeaf(range.index);
  //           console.log('Context format:', context.format);
  //           if (image && image.domNode && image.domNode.tagName === 'IMG') {
  //             console.log('Image detected and deleted via addBinding');
  //             quill.deleteText(range.index, 1);
  //             return true;
  //           }
  //           return false;
  //         },
  //       }
  //     );

  //     // DOM 이벤트 방식
  //     const handleKeyDown = (event) => {
  //       if (event.key === 'Delete') {
  //         const range = quill.getSelection();
  //         if (!range) return;

  //         const [leaf] = quill.getLeaf(range.index);
  //         if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
  //           console.log('Image delete detected via DOM event!');
  //           leaf.domNode.remove();
  //           quill.deleteText(range.index, 1);
  //         }
  //       }
  //     };

  //     const editor = quill.root;
  //     editor.addEventListener('keydown', handleKeyDown);

  //     return () => {
  //       editor.removeEventListener('keydown', handleKeyDown);
  //     };
  //   }
  // }, []);

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

  const wrapContentWithDiv = (htmlContent) => {
    return `<div className="w-full"><div
                className="relative bg-white p-4 rounded-md max-w-full overflow-hidden"
                style={{ minHeight: '600px' }} // 최소 높이 설정
              >${htmlContent}</div></div>`;
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
      images: imageFiles,
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
        primaryText: '날짜를 선택해주세요.',
        type: 'warning',
        isAutoClose: false,
        onConfirm: () => {
          closeModal(), setModalOpen(false);
        },
      });
    } else {
      // 수정 로직이라면
      console.log('수정일 때, 데이터 확인', data);
      console.log(documentType);
      console.log(documentData.id);
      if (documentData.isModify) {
        try {
          const response = await apiClient.put(
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
          console.log(error);
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
        console.log(data);
        try {
          const response = await apiClient.post(
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
          console.log(imageFiles);
          console.log(uploadedFiles);

          if (response.data.code == 201) {
            setModalOpen(true);
            openModal({
              primaryText: '글이 성공적으로 등��되었습니다.',
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

  // 파일 확인 및 다운로드 ( 에디터에서)
  const handleConfirm = async () => {
    const fileName =
      'certificate/b0a85319-02b2-4df2-b5b1-8d052579ffe1tree.jpeg';

    console.log('access', accesstoken);

    try {
      const response = await apiClient.get(
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
      const response = await apiClient.delete(
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
    } catch (error) {
      console.log(error);
    }
  };

  const findFileNameByUrl = (imageUrl, imageFiles) => {
    console.log('이미지url', imageUrl);
    console.log('이미지 파일', imageFiles);
    const file = imageFiles.find((file) => file.fileUrl === imageUrl);
    return file ? file.fileName : null;
  };

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();

      quill.keyboard.bindings = {};

      console.log('Quill 에디터 초기화 완료');

      // Quill 키보드 바인딩으로 삭제 감지
      quill.keyboard.addBinding(
        { key: 'Backspace' }, // Backspace 키 바인딩
        {
          collapsed: true,
          handler(range, context) {
            console.log('Backspace 키 감지');
            handleDeleteKeyPress(range, context, quill, 'Backspace');
            return false; // 기본 동작 방지
          },
        }
      );

      quill.keyboard.addBinding(
        { key: 'Delete' }, // Delete 키 바인딩
        {
          collapsed: true,
          handler(range, context) {
            console.log('Delete 키 감지');
            handleDeleteKeyPress(range, context, quill, 'Delete');
            return false; // 기본 동작 방지
          },
        }
      );

      console.log('테스트');
    }
  }, [imageFiles, handleDelete]);

  const handleDeleteKeyPress = async (range, context, quill, keyType) => {
    console.log(`${keyType} 키 감지`);

    if (!range) return;

    const [leaf] = quill.getLeaf(range.index);
    if (leaf && leaf.domNode && leaf.domNode.tagName === 'IMG') {
      const imageNode = leaf.domNode;
      const imageUrl = imageNode.src; // 이미지 URL 가져오기

      // URL에서 파일 이름 추출
      const fileName = findFileNameByUrl(imageUrl, imageFiles);

      if (!fileName) {
        console.error('File name not found for URL:', imageUrl);
        return;
      }

      try {
        // S3에서 이미지 삭제
        await handleDelete(fileName);
        console.log(`Image ${fileName} deleted from S3`);

        // imageFiles에서 삭제된 파일 제거
        setImageFiles((prevFiles) =>
          prevFiles.filter((file) => file.fileName !== fileName)
        );

        // Quill에서 이미지 제거
        imageNode.remove();
        quill.deleteText(range.index, 1);
      } catch (error) {
        console.error(`Failed to delete image ${fileName}`, error);
      }
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

  //         // 실제 렌더링된 크기 가��오기
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
          <span className="text-left text-gray3 text-xs mb-2">
            *업로드한 사진 삭제 시, Backspace로 사진 삭제해야 s3에서도
            삭제됩니다. (Delete 키는 s3 삭제 안 됨.)
          </span>
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
                    setUploadedFiles
                  )
                }
                className="bg-white mt-4 mb-4 p-3 rounded-lg border border-primary text-primary hover:bg-hoverLight w-fit"
              >
                파일 선택
              </div>

              {uploadedFiles.length > 0 && (
                <div className="flex flex-col space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={file.fileName || index}
                      className="flex px-4 py-2 space-x-2 justify-center items-center bg-white border border-gray2 w-fit rounded-full"
                    >
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

            {/* <div className="w-full flex flex-col justify-between" id="content">
              <div>{content}</div>
              <div className="flex flex-col mt-8">
                <div className="text-2xl font-bold mb-4">미리보기</div>
                <div
                  className="w-full overflow-auto border border-gray2 rounded-lg p-5"
                  dangerouslySetInnerHTML={{ __html: sanitizer(`${content}`) }}
                />
              </div>
            </div> */}
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
            {/* <button
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
            </button> */}
          </div>
        </div>
      </div>
      {modalOpen && <RenderModal />}
    </Layout>
  );
};

export default DocumentRegister;

import React, { useState, useRef, useMemo, useEffect } from 'react';
import axios from 'axios';

import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react';
import 'react-quill/dist/quill.snow.css';

Quill.register('modules/ImageResize', ImageResize);
import dompurify from 'dompurify';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';
import QuillModule from '../../components/QuillModule';

const DocumentCreate = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const accesstoken = localStorage.getItem('accessToken');

  const documentType = 'certificate';
  // NEWS CERTIFICATE GRADE

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

        console.log('엑세스', accesstoken);

        try {
          // 서버로 이미지 업로드
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

          // if (response.data.code == 201) {
          const fileName = response.data.data.fileName;
          const fileType = response.data.data.fileType;
          const fileUrl = response.data.data.fileUrl;

          const editor = quillRef.current.getEditor(); // Quill 인스턴스 가져오기
          const range = editor.getSelection(); // 현재 커서 위치 가져오기

          // 이미지 삽입
          editor.insertEmbed(range.index, 'image', fileUrl);
          // }

          // const imageUrl = response.data.imageUrl; // 서버에서 반환된 이미지 URL
          // const editor = quillRef.current.getEditor(); // Quill 인스턴스 가져오기
          // const range = editor.getSelection(); // 현재 커서 위치 가져오기

          // // 이미지 삽입
          // editor.insertEmbed(range.index, 'image', imageUrl);
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
        },
      },
      ImageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize'],
      },
    }),
    []
  );

  const sanitizer = dompurify.sanitize;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const quillRef = useRef(null);

  // 제목 입력
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  // 내용 입력
  const handleContent = (value) => {
    setContent(value);
    // console.log(value);
  };

  // src만 추출
  const srcArray = [];

  // 최종 src url 저장할곳
  const urlArray = [];

  const gainSource = /(<img[^>]*src\s*=\s*[\"']?([^>\"']+)[\"']?[^>]*>)/g;
  let index = 0; // 인덱스 변수 추가

  // async function SaveBoard() {
  //   // 이미지가 있을때만 아래 코드 실행(while)
  //   // 이미지 처리
  //   // 정규식으로 추출하여 배열에 저장
  //   while (gainSource.test(content)) {
  //     //   console.log('이미지가 있을때만 진행함.');
  //     let result = RegExp.$2;
  //     console.log('src 추출 결과 : ', result);
  //     srcArray.push(result);
  //     console.log('srcArray 추가: ', srcArray);

  //     // base64파일 Blop으로 바꾸기

  //     // dataURL 값이 data:image/jpeg:base64,~~~~~~~ 이므로
  //     //','를 기점으로 자른다.
  //     const byteString = atob(result.split(',')[1]);

  //     const ab = new ArrayBuffer(byteString.length);
  //     const ia = new Uint8Array(ab);

  //     for (let i = 0; i < byteString.length; i++) {
  //       // charCodeAt() 메서드는 주어진 인덱스에 대한 UTF-16 코드를 나타내는 0부터 65535 사이의 정수를 반환
  //       // 비트연산자 & 와 0xff(255) 값은 숫자를 양수로 표현하기 위한 설정
  //       ia[i] = byteString.charCodeAt(i);
  //     }
  //     const blob = new Blob([ia], {
  //       // base64 -> blob
  //       type: 'image/jpeg',
  //     });
  //     console.log('blob', blob);
  //     //   const file = new File([blob], 'image.jpg');
  //     const file = new File([blob], `image-${index}.jpg`);
  //     const formData = new FormData();
  //     formData.append('files[]', file);
  //     index++;
  //     console.log('formData: ', formData);

  //     formData.forEach((value, key) => {
  //       console.log(`formData key: ${key}, value:`, value);
  //     });
  //   }
  // }

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor(); // ReactQuill에서 Quill 인스턴스 가져오기
      editor.on('text-change', () => {
        const editorContainer = editor.root; // Quill 편집 영역의 root 컨테이너
        if (!editorContainer) {
          console.error('Editor container is not available.');
          return;
        }

        const images = editorContainer.querySelectorAll('img'); // 이미지 태그 찾기
        images.forEach((img, index) => {
          const width = img.style.width || img.getAttribute('width') || 'auto';
          const height =
            img.style.height || img.getAttribute('height') || 'auto';

          // 실제 렌더링된 크기 가져오기
          const { width: renderedWidth, height: renderedHeight } =
            img.getBoundingClientRect();

          console.log(
            `Image ${index + 1}: Width (style): ${width}, Height (style): ${height}`
          );
          console.log(
            `Image ${index + 1}: Rendered Width: ${renderedWidth}px, Rendered Height: ${renderedHeight}px`
          );
        });
      });
    }
  }, []);

  const handleCancel = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorContainer = editor.root; // Quill 편집 영역의 root 컨테이너
      const images = editorContainer.querySelectorAll('img'); // 모든 이미지 찾기

      // 모든 이미지 크기 동일하게 설정
      images.forEach((img) => {
        img.style.width = '200px';
        img.style.height = '200px';
      });

      console.log('All images resized to 200x200px');
    }
  };

  const handleConfirm = async () => {
    const fileName =
      'certificate/b0a85319-02b2-4df2-b5b1-8d052579ffe1tree.jpeg';

    console.log('access', accesstoken);

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/s3/download?fileName=${fileName}`,
        // `${apiUrl}/api/v1/s3/download?fileName=${encodeURIComponent(fileName)}`,
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

  const handleDelete = async () => {
    const fileName =
      'certificate/63aa6bd7-526e-4927-a225-d3fc3126e0b3tree.jpeg';

    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/s3?fileName=${fileName}`,
        {
          headers: {
            Authorization: accesstoken,
          },
          responseType: 'blob',
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center min-h-screen px-3 py-2">
        <div className="flex flex-col w-full slide-up">
          <SubNavbar
            items={navItems}
            activePage="인증서"
            mainCategory="자료실"
          />
          <div className="flex items-start">
            <input
              type="text"
              value={title}
              onChange={handleTitle}
              placeholder="제목을 입력하세요"
              className="mt-4 mb-4 text-4xl text-left placeholder:text-gray2"
            />
          </div>
          <hr className="w-full mb-4 border-t border-gray1" />
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
              // onClick={SaveBoard}
              className="px-4 py-2 font-bold text-white transition-colors duration-300 bg-primary rounded-lg w-1/6 hover:bg-hover"
            >
              등록
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
    </Layout>
  );
};

export default DocumentCreate;

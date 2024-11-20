import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Layout from '../../components/Layouts';
import SubNavbar from '../../components/SubNavbar';

import 'react-quill/dist/quill.snow.css';

const DocumentCreate = () => {
  const navItems = [
    { label: '인증서', route: '/certificate' },
    { label: '성적서', route: '/coa' },
    { label: '보도 자료', route: '/press' },
  ];

  const quillRef = useRef(null);

  const modules = {
    toolbar: {
      container: [
        ['link', 'image'], // 링크 및 이미지 삽입
        [{ header: [1, 2, 3, 4, 5, false] }], // 헤더 옵션
        ['bold', 'italic', 'underline', 'strike'], // 텍스트 스타일
        [{ list: 'ordered' }, { list: 'bullet' }], // 리스트
        ['clean'], // 포맷 초기화
      ],
    },
  };

  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setContent(value);
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
          <ReactQuill
            className="w-full h-1/2"
            theme="snow"
            onChange={handleChange}
            modules={modules}
          />
        </div>
      </div>
    </Layout>
  );
};

export default DocumentCreate;

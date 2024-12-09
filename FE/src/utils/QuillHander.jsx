import apiClient from '../services/apiClient';

export const handleImageUpload = async (
  quillRef,
  apiUrl,
  documentType,
  accesstoken,
  setUploadedFiles
) => {
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

export const handleFileUpload = async (
  apiUrl,
  documentType,
  accesstoken,
  setUploadedFiles
) => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', '*'); // 모든 파일 허용
  input.click();

  input.onchange = async () => {
    const file = input.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
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

        const fileUrl = response.data.data.fileUrl;
        const fileName = response.data.data.fileName;
        const fileType = response.data.data.fileType;

        setUploadedFiles((prevFiles) => [
          ...prevFiles,
          { fileUrl, fileType, fileName },
        ]);

        // 파일 링크 삽입
        // editor.insertText(range.index, fileName, 'link', fileUrl);
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  };
};

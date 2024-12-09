import { FaFile } from 'react-icons/fa';

const QuillModule = () => {
  return (
    <>
      <div className="ql-formats">
        <select className="ql-header" defaultValue="7">
          <option value="1">Header 1</option>
          <option value="2">Header 2</option>
          <option value="3">Header 3</option>
          <option value="4">Header 4</option>
          <option value="5">Header 5</option>
          <option value="6">Header 6</option>
          <option value="7">Normal</option>
        </select>
        <select className="ql-size" defaultValue="medium">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="huge">Huge</option>
        </select>
        <select className="ql-font" defaultValue="sans-serif" />
      </div>
      <div className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <button className="ql-blockquote" />
      </div>

      <div className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </div>
      <div className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
        <select className="ql-align">
          <option value="" /> {/* 기본: 왼쪽 정렬 */}
          <option value="center" /> {/* 가운데 정렬 */}
          <option value="right" /> {/* 오른쪽 정렬 */}
          <option value="justify" /> {/* 양쪽 정렬 */}
        </select>
      </div>
      <div className="ql-formats">
        <button className="ql-code-block" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
        {/* <button className="ql-attach-file text-[11px] text-gray4 ml-1">
          <FaFile />
        </button> */}
      </div>
    </>
  );
};

export default QuillModule;

const QnaAnswer = (qnaData) => {
  return (
    <>
      {qnaData.answered ? (
        // 답변이 달렸을 때
        <>
          <div className="flex flex-col w-full px-4 py-4 bg-placeHolder rounded-lg">
            <div className="flex items-center space-x-2 m-4">
              <span className="text-md text-gray4">관리자</span>
              <span className="text-sm text-gray3">
                {qnaData.answerCreatedAt}
              </span>
            </div>
            <div className="flex items-start m-4">
              <span className="text-md text-left">{qnaData.answerContent}</span>
            </div>
          </div>
        </>
      ) : (
        // 답변이 아직 없을 때
        <div className="flex w-full justify-center items-center min-h-[20vh]">
          <div className="text-center text-md">등록된 답변이 없습니다.</div>
        </div>
      )}
    </>
  );
};
export default QnaAnswer;

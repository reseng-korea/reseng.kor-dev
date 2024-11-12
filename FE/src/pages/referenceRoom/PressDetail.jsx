import Layout from '../../components/Layouts';

import { useNavigateTo } from '../../hooks/useNavigateTo';

import tmp5 from '../../assets/tmp_5.png';

const PressDetail = () => {
  // 페이지 이동
  const { navigateTo, routes } = useNavigateTo();

  return (
    <Layout>
      <div className="flex justify-center px-3 py-2 min-h-screen">
        <div className="w-full flex flex-col">
          {/* 하위 카테고리 */}
          <div className="text-3xl font-bold mt-16 mb-6">자료실</div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigateTo(routes.certificate)}
              className="w-32 h-10 bg-transition flex items-center justify-center border-none outline-none"
            >
              <span className="text-black hover:text-primary">인증서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.coa)}
              className="w-32 h-10 bg-transition flex items-center justify-center border-none outline-none"
            >
              <span className="text-black hover:text-primary">성적서</span>
            </button>
            <button
              onClick={() => navigateTo(routes.press)}
              className="w-32 h-10 bg-transition flex items-center justify-center border-0 border-b-2 border-primary rounded-none"
            >
              <span className="text-primary font-bold">보도 자료</span>
            </button>
          </div>
          <hr className="w-full border-t border-gray1 mb-6" />
          {/* 메인 */}
          <div className="flex flex-col">
            <div className="flex flex-col mt-4">
              <span className="text-2xl font-bold">
                리앤생, 연매출 10억 달성
              </span>
              <span className="text-gray3 mt-4">2024.10.18</span>
              <hr className="w-full mt-6 mb-6 border border-gray3" />
              <div className="flex flex-col items-center">
                <img className="w-1/2" src={tmp5} alt="인증서 1" />
                <span className="text-left mt-12">
                  (2024.10.08) (주)하나투어(대표이사 송미선)는 3분기 해외 패키지
                  송출객수가 전년 동기 대비 38% 증가한 49만 5천 명을 기록했다고
                  7일 밝혔다.
                  <br />
                  <br />
                  3분기에는 동남아(40%), 일본(26%), 중국(16%) 등 근거리 지역으로
                  떠나는 여행객 비중이 82%를 차지했다. 이어서 유럽(9%),
                  남태평양(6%), 미국(3%)이 뒤를 이었다. 근거리 지역 여행객
                  비중은 3분기 기준 작년 80.1%에서 올해 81.7%로 1.6% 소폭
                  상승했다.
                  <br />
                  <br />
                  특히, 올해 3분기에는 전년 동기 대비 동남아로 떠나는 여행객이
                  31% 증가했다. 동남아 중에서도 베트남(47.8%), 필리핀(16.9%),
                  태국(12.9%)를 차지했다. 베트남은 다낭, 하노이의 인기가
                  지속되는 가운데, 나트랑, 푸꾸옥의 예약률도 증가세를 보이며
                  인기여행지 1위로서의 자리를 유지하고 있다.
                  <br />
                  <br />
                  가장 눈에 띄는 건 중국의 증가세다. 중국 여행객은 전년 3분기
                  대비 112% 증가했고, 직전 분기 대비 또한 19% 증가했다. 장가계,
                  백두산을 비롯해 여름철 비교적 시원한 기후와 전세기 공급의
                  영향으로 내몽고와 몽골 수요 증가가 두드러졌다.
                  <br />
                  <br />
                  추석 연휴 특수가 있었던 9월 유럽 여행 수요는 전월 대비 65%
                  급증했다. 최장 9일간의 장기 연휴에 장거리 여행을 계획한 것으로
                  보인다.
                  <br />
                  <br />
                  하나투어 관계자는 “동남아, 일본 등 근거리 여행의 변함없는
                  인기와 함께 중국이 꾸준한 증가세를 보이는 점이 특징”이라며,
                  “10월 징검다리 연휴와 다가오는 연말연시에 힘입어 4분기 여행
                  수요도 기대하고 있다”라고 밝혔다.
                </span>
              </div>
            </div>
            {/* 목차 */}
            <div className="flex flex-col mt-24">
              <hr className="w-full mt-6 mb-6 border border-gray2" />
              <div className="flex space-x-12 px-4">
                <span>이전 글</span>
                <span>
                  리앤생, 한국 산업의 고객만족도(KCSI) 10년 연속 1위 달성
                </span>
              </div>
              <hr className="w-full mt-6 mb-6 border border-gray2" />
              <div className="flex space-x-12 px-4">
                <span>다음 글</span>
                <span>다음 글이 없습니다.</span>
              </div>
              <hr className="w-full mt-6 mb-6 border border-gray2" />
            </div>
            {/* 목록 */}
            <div className="flex items-center justify-center mt-4 mb-12">
              <button
                onClick={() => navigateTo(routes.press)}
                type="submit"
                className="px-8 py-2 font-bold border border-gray3 transition-colors duration-300 rounded-3xl hover:bg-white hover:text-primary"
              >
                목록
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PressDetail;

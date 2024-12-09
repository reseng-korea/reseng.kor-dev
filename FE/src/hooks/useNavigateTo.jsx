import { useNavigate } from 'react-router-dom';

export const useNavigateTo = () => {
  const navigate = useNavigate();

  // path와 state를 인자로 받아 페이지 이동 및 데이터 전달
  const navigateTo = (path, state = {}) => {
    navigate(path, { state });
  };

  // 객체로 관리
  const routes = {
    home: '/',
    signin: '/signin', // 토큰 있으면 x
    signup: '/signup', // 토큰 있으면 x
    socialinfo: '/socialinfo', //
    idinquiry: '/idinquiry', // 토큰 있으면 x
    idinquirySuccess: '/idinquiry/success', // 토큰 있으면 x
    idinquiryFailure: '/idinquiry/failure', // 토큰 있으면 x
    pwinquiry: '/pwinquiry', // 토큰 있으면 x
    pwinquiryNew: '/pwinquiry/new', // 토큰 있으면 x
    company: '/company',
    history: '/history',
    location: '/location',
    faq: '/faq',
    qna: '/qna',
    qnaRegist: '/qna/register', //토큰 있어야만
    qnaDetail: '/qna/:pageNumber', //
    certificate: '/certificate',
    coa: '/coa',
    press: '/press', //
    documentRegister: '/document/register', //
    documentDetail: '/:type/:id', //
    itemsBanner: '/items/banner',
    itemsBiodegradable: '/items/biodegradable',
    itemsRecycle: '/items/recycle',
    mypageMember: '/mypage/member', //
    mypageManage: '/mypage/manage', //
    mypageOrder: '/mypage/order', //
    mypageOrderList: '/mypage/orderlist', //
    mypageOfferList: '/mypage/offerlist', //
    mypageQr: '/mypage/qr', //
    mypageQrSuccess: '/mypage/qr/success', //
    mypageQrFailure: '/mypage/qr/failure', //
    mypageUserEdit: '/mypage/user/edit', //
    mypageUser: '/mypage/user', //
    mypageWithdraw: '/mypage/withdraw', //
    qrSuccess: '/mypage/qr/success', //
    qrFailure: '/mypage/qr/failure', //
    tmp: '/tmp',
    termsAndPolicyNonSocial: '/signup/termsAndPolicyNonSocial', //
    termsAndPolicySocial: '/signup/termsAndPolicySocial', //
    privacyPolicy: '/privacyPolicy', //
    termsOfUse: '/termsOfUse', //
  };

  return { navigateTo, routes };
};

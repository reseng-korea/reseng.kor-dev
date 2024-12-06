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
    signin: '/signin',
    signup: '/signup',
    socialinfo: '/socialinfo', //
    idinquiry: '/idinquiry',
    idinquirySuccess: '/idinquiry/success',
    idinquiryFailure: '/idinquiry/failure',
    pwinquiry: '/pwinquiry',
    pwinquiryNew: '/pwinquiry/new',
    company: '/company',
    history: '/history',
    location: '/location',
    faq: '/faq',
    qna: '/qna',
    qnaRegist: '/qna/register',
    qnaDetail: '/qna/:pageNumber',
    certificate: '/certificate',
    documentRegister: '/document/register',
    documentDetail: '/:type/:id',
    coa: '/coa',
    coaRegister: '/coa/register',
    coaDetail: '/coa/1',
    press: '/press',
    pressRegister: '/press/register',
    pressDetail: '/press/1',
    itemsBanner: '/items/banner',
    itemsBiodegradable: '/items/biodegradable',
    itemsRecycle: '/items/recycle',
    mypageMember: '/mypage/member',
    mypageManage: '/mypage/manage',
    mypageOrder: '/mypage/order',
    mypageOrderList: '/mypage/orderlist',
    mypageOfferList: '/mypage/offerlist',
    mypageQr: '/mypage/qr',
    mypageQrSuccess: '/mypage/qr/success',
    mypageQrFailure: '/mypage/qr/failure',
    mypageUserEdit: '/mypage/user/edit',
    mypageUser: '/mypage/user',
    mypageWithdraw: '/mypage/withdraw',
    qrSuccess: '/mypage/qr/success',
    qrFailure: '/mypage/qr/failure',
    tmp: '/tmp',
    termsAndPolicyNonSocial: '/signup/termsAndPolicyNonSocial',
    termsAndPolicySocial: '/signup/termsAndPolicySocial',
    privacyPolicy: '/privacyPolicy',
    termsOfUse: '/termsOfUse',
  };

  return { navigateTo, routes };
};

import { useNavigate } from 'react-router-dom';

export const useNavigateTo = () => {
  const navigate = useNavigate();

  // path를 인자로 받아서 해당 경로로 페이지 이동
  const navigateTo = (path) => {
    navigate(path);
  };

  // 객체로 관리
  const routes = {
    home: '/',
    signin: '/signin',
    signup: '/signup',
    socialinfo: '/socialinfo',
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
    qnaDetail: '/qna/1',
    certificate: '/certificate',
    coa: '/coa',
    coaRegister: 'coa/register',
    press: '/press',
    pressRegister: '/press/register',
    itemsBanner: '/items/banner',
    itemsBiodegradable: '/items/biodegradable',
    itemsRecycle: '/items/recycle',
    mypageMember: '/mypage/member',
    mypageManage: '/mypage/manage',
    mypageOrder: '/mypage/order',
    mypageQr: '/mypage/qr',
    mypageQrSuccess: '/mypage/qr/success',
    mypageQrFailure: '/mypage/qr/failure',
    mypageUserEdit: '/mypage/user/edit',
    mypageUser: '/mypage/user',
    mypageWithdraw: '/mypage/withdraw',
    tmp: '/tmp',
  };

  return { navigateTo, routes };
};

// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import {
//   isTokenExpiring,
//   refreshAccessToken,
// } from '../services/auth/authService';

// export const useTokenChecker = (handleTokenExpiration) => {
//   const location = useLocation(); // 현재 경로 추적

//   // useEffect(() => {
//   //   const checkToken = async () => {
//   //     if (isTokenExpiring()) {
//   //       await refreshAccessToken();
//   //     }
//   //   };

//   useEffect(() => {
//     const checkToken = async () => {
//       if (isTokenExpiring()) {
//         try {
//           await refreshAccessToken();
//         } catch (error) {
//           console.error('토큰 갱신 실패:', error);
//           if (handleTokenExpiration) {
//             handleTokenExpiration(); // 토큰 만료 시 처리
//           }
//         }
//       }
//     };

//     checkToken(); // 경로 변경 시 토큰 상태 확인
//   }, [location.pathname]); // location이 바뀔 때마다 실행
// };

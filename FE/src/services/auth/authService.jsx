// src/services/auth/authService.jsx
import axios from "axios";
import { handleTokenExpiration } from "../../App";

let openModalInstance = null;
export const setOpenModal = (openModal) => {
  openModalInstance = openModal;
};

const apiUrl = import.meta.env.VITE_API_BASE_URL;


export const handleLogin = (data, accessToken, setAccessToken, setUserInfo) => {
  setAccessToken(accessToken);
  setUserInfo({
    id: data.id,
    role: data.role,
    name: data.representativeName,
    loginType: data.loginType,
  }); 
};

export const refreshAccessToken = async (setAccessToken, setUserInfo) => {
  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/reissue`,
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.headers.authorization;
    
    if (!newAccessToken) {
      throw new Error("AccessToken을 가져올 수 없습니다.");
    }
    setAccessToken(newAccessToken);

    const userResponse = await axios.post(
      `${apiUrl}/api/v1/user-info`,
      {},
      {
        headers: { Authorization: `Bearer ${newAccessToken}` },
        withCredentials: true,
      }
    );

    setUserInfo({
      id: userResponse.data.id,
      role: userResponse.data.role,
      name: userResponse.data.name, 
      loginType: userResponse.data.loginType,
    });

  } catch (error) {
    console.error("🔴 AccessToken 갱신 실패:", error);
    if (typeof handleTokenExpiration === "function") {
      handleTokenExpiration(openModalInstance);
    }
  }
};
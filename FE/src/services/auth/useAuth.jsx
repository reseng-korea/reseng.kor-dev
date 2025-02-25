// src/hooks/useAuth.jsx
import { useState, useEffect } from "react";
import { refreshAccessToken } from "../services/auth/authService";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null); 

  useEffect(() => {
    refreshAccessToken(setAccessToken, setUserInfo); 
  }, []);

  return { accessToken, setAccessToken, userInfo, setUserInfo };
};

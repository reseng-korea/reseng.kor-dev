import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/user-info`, {
          withCredentials: true,
        });
        setUserInfo(response.data.data);
      } catch (error) {
        setUserInfo(null);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// 🚀 useUserInfo 훅 생성 (다른 컴포넌트에서 쉽게 사용)
export const useUserInfo = () => useContext(UserContext);

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const meResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/me`,
          { withCredentials: true },
        );
        setUser(meResponse.data?.data.user || null);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
              {},
              { withCredentials: true },
            );

            const retryResponse = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/users/me`,
              { withCredentials: true },
            );

            setUser(retryResponse.data?.data.user || null);
          } catch (refreshError) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setAuthLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

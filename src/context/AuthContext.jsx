import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { clearAuthData } from "../utils/authUtils";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData); // ✅ Cập nhật state user
    
    // Điều hướng dựa trên role
    if (userData?.role !== null) {
      navigate("/");
    }
    else {
      navigate("/");
    }
  };

  const logout = () => {
    clearAuthData()
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    setIsLoggedIn(false);
    setUser(null); // ✅ Xóa user khi logout
    navigate("/");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("user");
  
    if (storedToken && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // ✅ Gán user từ localStorage
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
}
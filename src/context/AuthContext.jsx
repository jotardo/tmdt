import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import userApi from "../backend/db/userApi";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  
  // Upon login, request a get info request to set user
  // Since this works using promise, setUser is set here
  const requestUserInfo = (user_id) => {
    return userApi.getDetail(user_id);
  }

  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwtToken"));
  const [user, setUser] = useState(null);

  const login = (token, userID) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("user", userID);

    setIsLoggedIn(true);
    requestUserInfo(userID).then(userDetails => {
      console.log(userDetails)
      setUser(userDetails.data)
      // Điều hướng dựa trên role
      if (userDetails?.role !== null) {
        navigate("/admin/dashboard");
      }
      else {
        navigate("/");
      }
    }) // ✅ Cập nhật state user
    .catch(err => {
      logout()
      toast.error("Something was wrong, please relogin!" + err);
    })
    
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    setIsLoggedIn(false);
    setUser(null); // ✅ Xóa user khi logout
    navigate("/");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUserID = localStorage.getItem("user");
  
    if (storedToken && storedUserID) {
      setIsLoggedIn(true);
      requestUserInfo(storedUserID).then(userDetails => setUser(userDetails.data)); // ✅ Gán user từ localStorage
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
  
}

export function useAuth() {
  return useContext(AuthContext);
}
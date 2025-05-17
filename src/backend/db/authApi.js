import axiosClient from "../api/axiosClient";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

console.log("Sending login request to: ", axiosClient.defaults.baseURL + "/user/login");

const authApi = {
  login: async (data) => {
    try {
      console.log("📤 Đăng nhập với:", data); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.post("/user/login", {
        emailId: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi đăng nhập:", error);
      throw error;
    }
  },


  register: async (data) => {
    try {
      const response = await axiosClient.post("/user/register", {
        firstName: data.firstName,
        lastName: data.lastName,
        emailId: data.email, // 🔥 Đổi từ `emailId` -> `email` (để đồng nhất với backend)
        username: data.username,
        password: data.password, // 🔥 Gửi password để backend mã hóa
        role: data.role || "Student",
      });
      console.log("Register response: ", response);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  },

  verifyEmail: async (token) => {
    try {
      console.log("🔍 Sending token:", token); // Kiểm tra token trước khi gửi
      const response = await axiosClient.get(`/user/confirm?token=${token}`);
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      console.error("❌ API Error:", error.response ? error.response.data : error.message);
      return { success: false }; // Tránh lỗi khi API bị lỗi
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem("loginDetails");
    } catch (error) {
      throw new Error("Lỗi khi đăng xuất");
    }
  },
};

export default authApi;
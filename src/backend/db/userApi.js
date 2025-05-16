import axiosClient from "../api/axiosClient";

const userApi = {
  getDetail: async (user_id) => {
    try {
      console.log("📤 Lấy thông tin người dùng:", user_id); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.get(`/user/info/${user_id}`);
      
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },
};

export default userApi;
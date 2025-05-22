import axiosClient from "../api/axiosClient";

const userApi = {
  getListUsers: async (data) => {
    try {
      console.log("📤 Lấy danh sách người dùng:", data); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.get("/user/users");
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
      return this
    }
  },
  getDetail: async (user_id) => {
    try {
      console.log("📤 Lấy thông tin người dùng:", user_id); // Debug dữ liệu đầu vào
      const response = await axiosClient.get(`/user/info/${user_id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin người dùng:", error);
      return this;
    }
  },
};

export default userApi;
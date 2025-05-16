import axiosClient from "../api/axiosClient";

//console.log("Sending login request to: ", axiosClient.defaults.baseURL + "/user/login");

const userAdminApi = {
  listUsers: async (data) => {
    try {
      console.log("📤 Lấy danh sách người dùng:", data); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.get("/user/users");
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", error);
      throw error;
    }
  },
};

export default userAdminApi;
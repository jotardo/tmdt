import axiosClient from "../api/axiosClient";

const deliveryAddressApi = {
  fetchByUser: async (user_id) => {
    try {
      console.log("📤 Lấy sổ địa chỉ:", user_id); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.get(`/delivery/fetch-user/${user_id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy sổ địa chỉ:", error);
      return error.data
    }
  },
  addNewAddress: async (data) => {
    try {
      console.log("📤 Thêm địa chỉ:", data); // Debug dữ liệu đầu vào
      const response = await axiosClient.get(`/delivery/add`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi thêm địa chỉ:", error);
      return error.data;
    }
  },
};

export default deliveryAddressApi;
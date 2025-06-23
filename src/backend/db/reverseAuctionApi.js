import axiosClient from "../api/axiosClient";

const reverseAuctionApi = {
  getAllAuctionProduct: async () => await axiosClient.get('/reverse-auction/fetch-all'),
  registerAuction: async (data) => {
    try {
      console.log("📤 Tạo Request:", data); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.post(`/reverse-auction/register`, data);
      console.log("Trả về", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy sổ địa chỉ:", error);
      return error.data || error
    }
  },
  getRoomChat: async (data) => {
    try {
      console.log("📤 LẤY ROOm Chat:", data); // Debug dữ liệu đầu vào
  
      const response = await axiosClient.get(`/reverse-auction/fetch-room/my/${data.userID}?productID=${data.productID}`);
      console.log("Trả về", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy sổ địa chỉ:", error);
      return error.data || error
    }
  },
  getRoomChatHistory: async (roomID) => await axiosClient.get(`/chat/history?roomID=${roomID}`),
};

export default reverseAuctionApi;
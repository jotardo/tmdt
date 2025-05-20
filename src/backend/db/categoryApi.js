import axiosClient from "../api/axiosClient";

const categoryApi = {
  addCategory: async (data) => {
    console.log("📤 Gửi yêu cầu thêm danh mục với:", data); // Debug dữ liệu đầu vào
    return await axiosClient.post("/category/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  fetchAllCategories: async () => {
    console.log("📤 Gửi yêu cầu lấy tất cả danh mục");
    return await axiosClient.get("/category/fetch/all");
  },
}

export default categoryApi;

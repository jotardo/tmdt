import axiosClient from "../api/axiosClient";

const categoryApi = {
  // Thêm danh mục mới
  addCategory: async (data) => {
    console.log("📤 Gửi yêu cầu thêm danh mục với:", data);
    return await axiosClient.post("/category/add", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật danh mục (không có hình ảnh)
  updateCategory: async (id, formData) => {
    console.log("📤 Gửi yêu cầu cập nhật danh mục với:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    
    return await axiosClient.put(`/category/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Lấy tất cả danh mục
  fetchAllCategories: async () => {
    return await axiosClient.get("/category/fetch/all");
  },

  // Lấy danh mục đã bị xóa
  fetchAllDeletedCategories: async () => {
    console.log("📤 Gửi yêu cầu lấy danh mục đã bị xóa");
    return await axiosClient.get("/category/fetch-deleted/all");
  },

  // Khôi phục danh mục
  restoreCategory: async (categoryId) => {
    console.log("♻️ Gửi yêu cầu khôi phục danh mục:", categoryId);
    return await axiosClient.put("/category/restore", null, {
      params: { categoryId },
    });
  },

  // Xóa mềm danh mục
  deleteCategory: async (categoryId) => {
    console.log("🗑️ Gửi yêu cầu xóa mềm danh mục:", categoryId);
    return await axiosClient.delete("/category/delete", {
      params: { categoryId },
    });
  },

  // Xóa vĩnh viễn danh mục
  deleteCategoryPermanently: async (categoryId) => {
    console.log("🧨 Gửi yêu cầu xóa vĩnh viễn danh mục:", categoryId);
    return await axiosClient.delete("/category/delete-permanently", {
      params: { categoryId },
    });
  },

  // Lấy hình ảnh danh mục
  fetchCategoryImage: (imageName) => {
    return axiosClient.get(`/category/${imageName}`, {
      responseType: "blob",
    });
  },
};

export default categoryApi;

import axiosClient from "../api/axiosClient";

const productApi = {
  // Thêm danh mục mới
  addProduct: async (formData) => {
    console.log("📤 Gửi yêu cầu thêm sản phẩm với:");
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: ${pair[1].name}`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
  
    return await axiosClient.post("/product/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }); // ❌ KHÔNG thêm headers
  },

  updateCategory: async (productId, formData) => {
    console.log("📤 Gửi yêu cầu cập nhật sản phẩm với ID:", productId);
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: ${pair[1].name}`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
  
    return await axiosClient.put(`/product/update/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  

  fetchAllProducts: async () => {
    return await axiosClient.get("/product/fetch-all");
  },

  fetchAllDeletedProducts: async () => {
    console.log("📤 Gửi yêu cầu lấy danh mục đã bị xóa");
    return await axiosClient.get("/product/fetch-deleted/all");
  },

  // Khôi phục danh mục
  restoreProduct: async (productId) => {
    console.log("♻️ Gửi yêu cầu khôi phục danh mục:", productId);
    return await axiosClient.put("/product/restore", null, {
      params: { productId },
    });
  },

  // Xóa mềm danh mục
  deleteProduct: async (productId) => {
    console.log("🗑️ Gửi yêu cầu xóa mềm danh mục:", productId);
    return await axiosClient.delete("/product/delete", {
      params: { productId },
    });
  },

  // Xóa vĩnh viễn danh mục
  deleteProductPermanently: async (productId) => {
    console.log("🧨 Gửi yêu cầu xóa vĩnh viễn danh mục:", productId);
    return await axiosClient.delete("/product/delete-permanently", {
      params: { productId },
    });
  },

  // Lấy hình ảnh danh mục
  fetchProductImage: (imageName) => {
    return axiosClient.get(`/product/${imageName}`, {
      responseType: "blob",
    });
  },

}

export default productApi;
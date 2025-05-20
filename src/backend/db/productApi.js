import axiosClient from "../api/axiosClient";

const productApi = {
    fetchAllProduct: async () => {
        const uh = await axiosClient.get("/product/fetch-all");
        return uh.data;
    },
    addNewProduct: async (data) => {
        const response = await axiosClient.post("/product/add", data);
        return response.data;
    }
}

export default productApi;
import axiosClient from "../api/axiosClient";

const orderApi = {
    fetchAllOrderData: async () => axiosClient.get("/orders/fetch/full"),
    fetchAllOrder: async () => axiosClient.get("/orders/fetch/all"),
    fetchOrderDetails: async (order_id) => axiosClient.get(`/orders/fetch/detail/${order_id}`),

}

export default orderApi;
import axiosClient from "../api/axiosClient";

const orderApi = {
    fetchAllOrderData: async () => axiosClient.get("/orders/fetch/full"),
    fetchAllOrder: async () => axiosClient.get("/orders/fetch/all"),
    fetchOrderDetails: async (order_id) => axiosClient.get(`/orders/fetch/detail/${order_id}`),
    updateOrderStatus: async (order_id, order_status) => axiosClient.post(`/orders/update/${order_id}`, {}, {params: {
        status: order_status
    }}),

}

export default orderApi;
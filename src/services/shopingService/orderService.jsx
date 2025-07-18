import axiosClient from "../../backend/api/axiosClient";
import orderApi from "../../backend/db/orderApi";

export async function createOrder(orderData, token) {
    try {
        const response = await axiosClient.post(
            "orders/create",
            orderData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Đơn hàng đã được tạo:", response.data?.success);
        return response;
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error.response?.data || error.message);
        throw error;
    }

}
    export async function verifyOtp(orderId, otpCode, token) {
        try {
            const response = await axiosClient.post(
                "verify/verify-otp",
                {
                    orderId,
                    otpCode,
                },{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log("Kết quả xác thực OTP:", response.data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xác thực OTP:", error.response?.data || error.message);
            throw error;
        }
    }

export async function resendOTP(orderId, token) {
    try {
        const response = await axiosClient.post(
            `order/resend-otp/${orderId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Đã gửi:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi lại OTP:", error.response?.data || error.message);
        throw error;
    }
}

export async function fetchAllOrderData() {
    try {
        const response = await orderApi.fetchAllOrderData();
        console.log("Đã gửi:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetchAllOrderData:", error.response?.data || error.message || error.data);
        return error
    }
}

export async function createStripeSession(orderId, token) {
    try {
        const response = await axiosClient.post(
            "/payment/create-stripe-session",
            { id: orderId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Stripe checkout URL:", response.data.checkoutUrl);
        return response.data.checkoutUrl;
    } catch (error) {
        console.error("Lỗi khi tạo Stripe session:", error.response?.data || error.message);
        throw error;
    }
}



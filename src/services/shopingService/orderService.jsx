import axiosClient from "../../backend/api/axiosClient";

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


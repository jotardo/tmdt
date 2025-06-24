import axiosClient from "../../backend/api/axiosClient";


export const getAllProducts = async() => {
    const response = await axiosClient.get('/product/list');
    return response.data;
};

export const getProduct = async (productId) => {
    const response = await axiosClient.get(`/product/${productId}`);
    return response.data;
};

export const getReviewsByProductId = async (productId) => {
    try {
        const response = await axiosClient.get(`/reviews/product/${productId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addReview = async (reviewData, userId) => {
    try {
        const response = await axiosClient.post(
            "/reviews",
            reviewData,
            {
                headers: {
                    userId: userId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi gửi review:", error);
        throw error;
    }
};


export const updateReview = async (reviewId, reviewData, userId) => {
    try {
        const response = await axiosClient.put(`/reviews/${reviewId}`, reviewData, { headers: { userId: userId } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteReview = async (reviewId, userId) => {
    try {
        await axiosClient.delete(`/reviews/${reviewId}`, { headers: { userId: userId } });
    } catch (error) {
        throw error;
    }
};

export const getAverageRatingForProduct = async (productId) => {
    try {
        const response = await axiosClient.get(`/reviews/product/${productId}/average-rating`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTotalReviewsForProduct = async (productId) => {
    try {
        const response = await axiosClient.get(`/reviews/product/${productId}/total-reviews`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const incrementHelpfulCount = async (reviewId) => {
    try {
        const response = await axiosClient.put(`/reviews/${reviewId}/helpful`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

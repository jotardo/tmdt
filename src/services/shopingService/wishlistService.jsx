import axiosClient from "../../backend/api/axiosClient";

export const getWishList = async (userId, encodedToken) =>
    await axiosClient.get('/wishlist', {
        headers: { Authorization: `Bearer ${encodedToken}` },
        params: { userId }
    });

export const addToWishlist = async (userId, productId, encodedToken) =>
    await axiosClient.post('/wishlist/add', null, {
        headers: { Authorization: `Bearer ${encodedToken}` },
        params: { userId, productId }
    });

export const removeFromWishlist = async (userId, productId, encodedToken) =>
    await axiosClient.delete('/wishlist/remove', {
        headers: { Authorization: `Bearer ${encodedToken}` },
        params: { userId, productId }
    });


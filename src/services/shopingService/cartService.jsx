import axiosClient from "../../backend/api/axiosClient";

export async function getCartList(encodedToken, userId) {
    return await axiosClient.get(`/cart/get?userId=${userId}`, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
        },
    });
}


export const addToCart = async (userId, productId, quantity = 1, encodedToken) => {
    return await axiosClient.post(
        `/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`,
        {},
        {
            headers: {
                authorization: encodedToken,
            },
        }
    );
};


export const incDecQuantity = async (userId, cartItemId, token, action) => {
    return await axiosClient.put(
        `/cart/update-quantity`,
        null,
        {
            params: {
                userId,
                cartItemId,
                action,
            },
            headers: {
                authorization: token,
            },
        }
    );
};


export const deleteFromCart = async (userId, cartItemId, encodedToken ) => {
  return axiosClient.delete(`/cart/remove?userId=${userId}&cartItemId=${cartItemId}`, {
    headers: {
      authorization: encodedToken,
    },
  });
};

import axiosClient from "../../backend/api/axiosClient";

export const createReverseAuction = async (formData, encodedToken) => {
    return await axiosClient.post('/auctions/create', formData, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
            "Content-Type": undefined,
        },
    });
};



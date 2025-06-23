import axiosClient from "../../backend/api/axiosClient";

export const createReverseAuction = async (formData, encodedToken) => {
    return await axiosClient.post('/auctions/create', formData, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
            "Content-Type": undefined,
        },
    });
};


export const fetchAuctionsForAdmin = async (page = 0, size = 10, status = '', encodedToken) => {
    let url = `/admin/auctions/list-all?page=${page}&size=${size}`;
    if (status && status !== 'ALL') {
        url += `&status=${status}`;
    }

    return await axiosClient.get(url, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
        },
    });
};

export const softDeleteAuctionAPI = async (productId, encodedToken) => {
    const url = `/admin/auctions/${productId}/delete`;
    return await axiosClient.delete(url, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
        },
    });
};


export const restoreAuctionAPI = async (productId, encodedToken) => {
    const url = `/admin/auctions/${productId}/restore`;
    return await axiosClient.post(url, null, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
        },
    });
};

export const promoteAuctionAPI = async (productId, promotionData, encodedToken) => {
    const url = `/admin/auctions/${productId}/promote`;
    return await axiosClient.post(url, promotionData, { // promotionData là một JSON
        headers: {
            Authorization: `Bearer ${encodedToken}`,
            'Content-Type': 'application/json',
        },
    });
};

export const getAuctionDetailsForAdmin = async (auctionProductId, encodedToken) => {
    const url = `/admin/auctions/${auctionProductId}/details`;
    return await axiosClient.get(url, {
        headers: {
            Authorization: `Bearer ${encodedToken}`,
        },
    });
};
import axiosClient from "../../backend/api/axiosClient";


export const getAllProducts = async() => axiosClient.get('/product/fetch-all');

export const getProduct = async (productId) => await axiosClient.get(`/product/${productId}`);

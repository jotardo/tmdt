import axiosClient from "../../backend/api/axiosClient";

export const getAllCategories = async ()=> await axiosClient.get('/category/fetch/all');


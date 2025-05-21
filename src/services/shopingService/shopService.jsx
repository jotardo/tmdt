import axios from 'axios'

export const getAllProducts = async()=>axios.get('http://localhost:8080/api/product/list').then(res => res.data);

export const getProduct = async (productId) => await axios.get(`http://localhost:8080/api/product/${productId}`);
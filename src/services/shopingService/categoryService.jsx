import axios from 'axios'

export const getAllCategories = async ()=> await axios.get('/api/category/fetch/all');


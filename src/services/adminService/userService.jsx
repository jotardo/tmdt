import axios from 'axios'

export const userListService= async() => await axios.post('/api/user/users')
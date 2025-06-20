import axios from "axios";

// Địa chỉ backend, đổi IP nếu cần
const IP_ADDRESS = process.env.REACT_APP_BASE_URL;
console.log("BaseURL: ", IP_ADDRESS);

const axiosClient = axios.create({
  baseURL: IP_ADDRESS,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  },
});


// Interceptor thêm token (nếu có)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosClient;

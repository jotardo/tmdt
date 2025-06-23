import axios from "axios";
import axiosClient from "../api/axiosClient";

const publicAxios = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

const topicApi = {
  // Lấy tất cả các chủ đề
  fetchAll: async () => {
    return await axiosClient.get("/topic/fetch-all");
  },

  // Thêm chủ đề mới
  createTopic: async (topicData) => {
    return await publicAxios.post("/topic/create", topicData);
  },

  // Xem chi tiết một chủ đề theo ID
  fetchById: async (topicID) => {
    return await axiosClient.get(`/topic/${topicID}`);
  }
};

export default topicApi;

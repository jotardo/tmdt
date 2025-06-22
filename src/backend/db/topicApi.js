import axiosClient from "../api/axiosClient";

const topicApi = {
  // Lấy tất cả các chủ đề
  fetchAll: async () => {
    return await axiosClient.get("/topic/fetch-all");
  },

  // Thêm chủ đề mới
  createTopic: async (topicData) => {
    return await axiosClient.post("/topic/create", topicData);
  },

  // Xem chi tiết một chủ đề theo ID
  fetchById: async (topicID) => {
    return await axiosClient.get(`/topic/${topicID}`);
  }
};

export default topicApi;

import axiosClient from "../api/axiosClient";

const commentApi = {
  createComment: async (commentData) => {
    const payload = { ...commentData };
    const response = await axiosClient.post('/comment/create', payload);
    return response.data;
  },
  fetchAllCommentNoParent: async (topicID) => {
    const response = await axiosClient.get(`/comment/fetch-all-comment-parent/${topicID}`);
    return response.data;
  },
  fetchAllCommentChild: async (parentID) => {
    const response = await axiosClient.get(`/comment/fetch-all-children-comment/${parentID}`);
    return response.data;
  }
};

export default commentApi;
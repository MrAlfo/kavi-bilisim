import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async () => {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
};

export const fetchPostDetails = async (postId: number) => {
  const response = await axios.get(`${BASE_URL}/posts/${postId}`);
  return response.data;
};

export const fetchUserDetails = async (userId: number) => {
  const response = await axios.get(`${BASE_URL}/users/${userId}`);
  return response.data;
};

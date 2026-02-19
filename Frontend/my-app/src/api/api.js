import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Your team's AI server

export const sendFrameToAI = async (imageBlob) => {
  const formData = new FormData();
  formData.append('file', imageBlob);

  const response = await axios.post(`${API_BASE_URL}/predict`, formData);
  return response.data; // Returns recognized sign
};

export const getSignFromText = async (text) => {
  const response = await axios.get(`${API_BASE_URL}/text-to-sign?query=${text}`);
  return response.data; // Returns path to GIF/Animation
};